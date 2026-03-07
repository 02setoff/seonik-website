import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 10;
const LOCKOUT_MINUTES = 5;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        // 잠금 상태 확인 (보안: 잠금된 계정은 무조건 실패)
        if (user.loginLockedUntil && new Date() < user.loginLockedUntil) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          // 실패 횟수 누적
          const newAttempts = (user.loginAttempts ?? 0) + 1;
          const updateData: Record<string, unknown> = { loginAttempts: newAttempts };

          // MAX_ATTEMPTS 이상 실패 시 잠금
          if (newAttempts >= MAX_ATTEMPTS) {
            updateData.loginLockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
          }

          await prisma.user.update({ where: { id: user.id }, data: updateData });
          return null;
        }

        // 로그인 성공: 카운터 초기화
        await prisma.user.update({
          where: { id: user.id },
          data: { loginAttempts: 0, loginLockedUntil: null },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          mustResetPassword: user.mustResetPassword,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.mustResetPassword = (user as { mustResetPassword?: boolean }).mustResetPassword ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string; mustResetPassword?: boolean }).id = token.id as string;
        (session.user as { id?: string; mustResetPassword?: boolean }).mustResetPassword = token.mustResetPassword as boolean;
      }
      return session;
    },
  },
};
