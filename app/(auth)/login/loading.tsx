import { LoadingCenter } from "@/components/ui/spinner";

export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-wine-800">ワイン管理システム</h1>
          <p className="text-sm text-stone-500">次世代ワイン管理システム</p>
        </div>
        <LoadingCenter label="読み込み中..." />
      </div>
    </div>
  );
}
