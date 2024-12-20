import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./PrismaClient";
import { loginSchema } from "./schemas/LoginSchema";
import bcrypt from "bcrypt";

export const authOptions = {
  // adapter: PrismaAdapter(prisma),
  providers: [
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
        token.id = user.id;
      }
      return token;
    },
    async session({ token, session }: any) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
