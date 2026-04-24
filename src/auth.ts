import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { JWT } from '@auth/core/jwt';

import authConfig from '@/auth.config';
import { prisma } from '@/lib/prisma';

/**
 * 🔐 Extension des types NextAuth
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role?: string;
  }
}

/**
 * 🔐 Extension JWT (NextAuth v5)
 */
declare module '@auth/core/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}

/**
 * 🚀 Configuration NextAuth
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  session: {
    strategy: 'jwt',
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: 'Login', type: 'text' },
        password: { label: 'Mot de passe', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.utilisateur.findUnique({
          where: {
            login: String(credentials.email),
          },
        });

        // 🔥 IMPORTANT : utiliser motDePasse (pas mot_de_passe)
        if (!user || !user.motDePasse || !user.actif) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          String(credentials.password),
          user.motDePasse,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: String(user.idUser),
          name:
            `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() ||
            user.login,
          email: user.login,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
  ...authConfig.callbacks,

  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = String(token.id ?? '');
      session.user.role = String(token.role ?? 'USER');
    }

    return session;
  },
},
});