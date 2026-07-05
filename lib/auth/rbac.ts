import type { UserRole } from "@/lib/auth/roles";

const STORE_ROLES: UserRole[] = ["STORE_STAFF", "STORE_MANAGER"];
const WAREHOUSE_ROLES: UserRole[] = ["WAREHOUSE_STAFF", "WAREHOUSE_MANAGER"];
const HQ_ROLES: UserRole[] = ["HQ_STAFF", "HQ_ADMIN"];

export function getRoleHomePath(role: UserRole): string {
  if (STORE_ROLES.includes(role)) return "/store";
  if (WAREHOUSE_ROLES.includes(role)) return "/warehouse";
  if (HQ_ROLES.includes(role)) return "/hq";
  return "/login";
}

export function isStoreRole(role: UserRole): boolean {
  return STORE_ROLES.includes(role);
}

export function isWarehouseRole(role: UserRole): boolean {
  return WAREHOUSE_ROLES.includes(role);
}

export function isHqRole(role: UserRole): boolean {
  return HQ_ROLES.includes(role);
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  if (pathname.startsWith("/store")) return isStoreRole(role);
  if (pathname.startsWith("/warehouse")) return isWarehouseRole(role);
  if (pathname.startsWith("/hq")) return isHqRole(role);
  return true;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  STORE_STAFF: "店舗スタッフ",
  STORE_MANAGER: "店舗管理者",
  WAREHOUSE_STAFF: "倉庫担当",
  WAREHOUSE_MANAGER: "倉庫管理者",
  HQ_STAFF: "本部スタッフ",
  HQ_ADMIN: "本部管理者",
};

export type { UserRole };
