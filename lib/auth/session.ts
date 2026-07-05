import { auth } from "@/lib/auth";
import {
  canAccessPath,
  isHqRole,
  isStoreRole,
  isWarehouseRole,
} from "@/lib/auth/rbac";
import type { UserRole } from "@/lib/auth/roles";
import type { SessionUser } from "@/lib/auth/types";

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(roles: UserRole[]): Promise<SessionUser> {
  const user = await requireSessionUser();
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function requireLocation(): Promise<SessionUser> {
  const user = await requireSessionUser();
  if (!user.locationId && !isHqRole(user.role)) {
    throw new Error("Location required");
  }
  return user;
}

export function assertPathAccess(user: SessionUser, pathname: string): void {
  if (!canAccessPath(user.role, pathname)) {
    throw new Error("Forbidden");
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
