import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "rishu@example.com" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (
                credentials
            ): Promise<{ id: string; name: string | null; email: string } | null> => {
                if (!credentials?.email || !credentials?.password) return null;

                const existingUser = await db.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!existingUser || !existingUser.password) return null;

                const isPasswordCorrect = await compare(credentials.password, existingUser.password);
                if (!isPasswordCorrect) return null;

                return {
                    id: `${existingUser.id}`,
                    name: existingUser.name,
                    email: existingUser.email,
                };
            }

        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    name: token.name,
                },
            };
        },
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
            }
            return token;
        },
    },
};
