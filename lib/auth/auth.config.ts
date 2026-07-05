import type { NextAuthConfig } from "next-auth";

import type { SessionUser } from "@/lib/auth/types";

/**
 * Edge-safe Auth.js config — no providers, DB, or bcrypt.
 * Used by middleware only. Providers are added in lib/auth/index.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.locationId = user.locationId;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id as string,
          email: token.email!,
          name: token.name!,
          role: token.role as SessionUser["role"],
          locationId: (token.locationId as string | null) ?? null,
        },
      };
    },
  },
  providers: [],
} satisfies NextAuthConfig;
