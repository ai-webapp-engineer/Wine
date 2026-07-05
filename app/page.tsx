import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/auth/rbac";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  redirect(getRoleHomePath(session.user.role));
}
