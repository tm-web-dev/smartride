import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import { comparePassword } from "@/lib/bcrypt";

import dbConnect from "@/lib/dbConnect";

import Usermodel from "@/models/user";

import { Role } from "@/types/role";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials) {
          throw new Error(
            "Missing credentials"
          );
        }

        await dbConnect();

        // Normalize email
        const email =
          credentials.email
            .toLowerCase()
            .trim();

        // Find user
        const user =
          await Usermodel.findOne({
            email,
          });

        if (!user) {
          throw new Error(
            "User not found"
          );
        }

        // Check email verification
        if (!user.isVerified) {
          throw new Error(
            "EMAIL_NOT_VERIFIED"
          );
        }

        // Compare password
        const isPasswordCorrect =
          await comparePassword(
            credentials.password,
            user.password
          );

        if (!isPasswordCorrect) {
          throw new Error(
            "Invalid credentials"
          );
        }

        // Return user object
        return {
          id: user._id.toString(),

          name: user.name,

          email: user.email,

          role: user.role as Role,

          isVerified:
            user.isVerified,
        };
      },
    }),
  ],

  callbacks: {
    // JWT callback
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        token.name = user.name;

        token.email = user.email;

        token.role = user.role;

        token.isVerified =
          user.isVerified;
      }

      return token;
    },

    // Session callback
    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.name =
          token.name as string;

        session.user.email =
          token.email as string;

        session.user.role =
          token.role as Role;

        session.user.isVerified =
          token.isVerified as boolean;
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret:
    process.env.NEXTAUTH_SECRET,
};