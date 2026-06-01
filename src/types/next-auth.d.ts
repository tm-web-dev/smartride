import { Role } from "./role";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    isVerified: boolean;
    role: Role;
    name: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      isVerified: boolean;
      role: Role;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    isVerified: boolean;
    role: Role;
    name: string;
  }
}