import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { canAccessPath, getRoleHomePath } from "@/lib/auth/rbac";

const publicPaths = ["/login", "/api/auth"];

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  const isApi = pathname.startsWith("/api");
  const user = request.auth?.user;

  if (!user && !isPublic && pathname !== "/") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL(getRoleHomePath(user.role), request.url));
  }

  if (user && !isPublic && !isApi && !canAccessPath(user.role, pathname)) {
    return NextResponse.redirect(new URL(getRoleHomePath(user.role), request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
