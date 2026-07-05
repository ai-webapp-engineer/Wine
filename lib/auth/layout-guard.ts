import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { canAccessPath, getRoleHomePath } from "@/lib/auth/rbac";

export async function requireRoleLayout(pathPrefix: "/store" | "/warehouse" | "/hq") {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  if (!canAccessPath(session.user.role, pathPrefix)) {
    redirect(getRoleHomePath(session.user.role));
  }

  return session.user;
}
