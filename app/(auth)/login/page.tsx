import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/auth/rbac";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(getRoleHomePath(session.user.role));
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-wine-800">ワイン管理システム</h1>
          <p className="text-sm text-stone-500">次世代ワイン管理システム</p>
        </div>
        <LoginForm />
        <div className="rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
          <p className="font-medium text-stone-700">デモアカウント</p>
          <p>店舗: store@wine.local</p>
          <p>倉庫: warehouse@wine.local</p>
          <p>本部: admin@wine.local</p>
          <p>パスワード: password123</p>
        </div>
      </div>
    </div>
  );
}
