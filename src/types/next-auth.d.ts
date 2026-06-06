import { Role } from "./role";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    isVerified: boolean;
    role: Role;
    name: string;
    mustChangePassword: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      isVerified: boolean;
      role: Role;
      name: string;
      mustChangePassword: boolean;
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
    mustChangePassword: boolean;
  }
}