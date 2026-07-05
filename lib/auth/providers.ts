import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { db } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const credentialsProvider = Credentials({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const parsed = loginSchema.safeParse(credentials);
    if (!parsed.success) return null;

    const user = await db.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user || !user.isActive) return null;

    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!valid) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      locationId: user.locationId,
    };
  },
});
