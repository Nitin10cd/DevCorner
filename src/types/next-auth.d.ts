import NextAuth from "next-auth";

declare module "next-auth" {
   interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
  }

  interface Session {
    user: User & {
      address: string;
    };
    token: {
      username: string;
    };
  }
}