import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { canAccessPath, getRoleHomePath } from "@/lib/auth/rbac";

export async function requireRoleLayout(pathPrefix: "/store" | "/warehouse" | "/hq") {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  if (!canAccessPath(user.role, pathPrefix)) {
    redirect(getRoleHomePath(user.role));
  }

  return user;
}
