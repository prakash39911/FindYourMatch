import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

import prisma from "./PrismaClient";
import { loginSchema } from "./schemas/LoginSchema";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email ID",
          type: "text",
          placeholder: "Enter email",
          required: true,
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Password",
          required: true,
        },
      },
      async authorize(credentials: any) {
        const validate = loginSchema.safeParse(credentials);

        if (validate.success) {
          const { email, password } = validate.data;

          const existingUser = await prisma.user?.findUnique({
            where: {
              email,
            },
          });

          if (
            !existingUser ||
            !existingUser.password ||
            !(await bcrypt.compare(password, existingUser.password))
          ) {
            return null;
          }

          return existingUser;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        console.log("user", user);

        token.id = user.id;
        token.profileComplete = user.profileComplete;
      }
      return token;
    },
    async session({ token, session }: any) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.profileComplete = token.profileComplete;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};
