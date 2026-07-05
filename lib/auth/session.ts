import { cache } from "react";

import { getSession } from "@/lib/auth/get-session";
import {
  canAccessPath,
  isHqRole,
  isStoreRole,
  isWarehouseRole,
} from "@/lib/auth/rbac";
import type { UserRole } from "@/lib/auth/roles";
import type { SessionUser } from "@/lib/auth/types";
import { MSG } from "@/lib/messages/ja";

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const session = await getSession();
  return session?.user ?? null;
});

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error(MSG.UNAUTHORIZED);
  }
  return user;
}

export async function requireRole(roles: UserRole[]): Promise<SessionUser> {
  const user = await requireSessionUser();
  if (!roles.includes(user.role)) {
    throw new Error(MSG.FORBIDDEN);
  }
  return user;
}

export async function requireLocation(): Promise<SessionUser> {
  const user = await requireSessionUser();
  if (!user.locationId && !isHqRole(user.role)) {
    throw new Error(MSG.LOCATION_REQUIRED);
  }
  return user;
}

export function assertPathAccess(user: SessionUser, pathname: string): void {
  if (!canAccessPath(user.role, pathname)) {
    throw new Error(MSG.FORBIDDEN);
  }
}

export function getEffectiveLocationId(
  user: SessionUser,
  requestedLocationId?: string | null,
): string | null {
  if (isHqRole(user.role)) {
    return requestedLocationId ?? null;
  }
  return user.locationId;
}

export { isHqRole, isStoreRole, isWarehouseRole };
