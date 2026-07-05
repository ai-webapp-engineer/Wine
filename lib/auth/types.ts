import type { UserRole } from "@/lib/auth/roles";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  locationId: string | null;
};

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }

  interface User extends SessionUser {}
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    locationId: string | null;
  }
}
