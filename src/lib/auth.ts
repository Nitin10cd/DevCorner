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
            ): Promise<{ id: string; name: string | null; email: string; role: string } | null> => {
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
                    role: existingUser.role,
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
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.role = (user as any).role ?? "USER";
            } else if (!token.role) {
                const dbUser = await db.user.findUnique({
                    where: { email: token.email! },
                });

                token.role = dbUser?.role ?? "USER";
            }

            return token;
        },

        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    name: token.name,
                    role: token.role,
                },
            };
        },
    },
    events: {
        async createUser({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { role: "USER" },
            });
        },
    }
};
