import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold text-stone-900">404</h1>
      <p className="text-stone-500">ページが見つかりません</p>
      <Link href="/" className="text-sm font-medium text-wine-800 hover:underline">
        ホームへ戻る
      </Link>
    </div>
  );
}
