import { PageShell } from "@/app/(hq)/hq/layout";
import { UserForm } from "@/components/hq/user-form";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import { db } from "@/lib/db";

export default async function HqUsersPage() {
  const [users, locations] = await Promise.all([
    db.user.findMany({
      include: { location: true },
      orderBy: { email: "asc" },
    }),
    db.location.findMany({ where: { isActive: true }, orderBy: { code: "asc" } }),
  ]);

  return (
    <PageShell title="ユーザー管理" description="ロールと拠点の割当">
      <UserForm locations={locations.map((l) => ({ id: l.id, name: l.name }))} />
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-600">
            <tr>
              <th className="px-4 py-3">名前</th>
              <th className="px-4 py-3">メール</th>
              <th className="px-4 py-3">ロール</th>
              <th className="px-4 py-3">拠点</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-stone-100">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{ROLE_LABELS[user.role]}</td>
                <td className="px-4 py-3">{user.location?.name ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
