import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth/auth.config";
import { credentialsProvider } from "@/lib/auth/providers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [credentialsProvider],
});
