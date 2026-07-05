import { PageShell } from "@/app/(hq)/hq/layout";
import { UserForm } from "@/components/hq/user-form";
import { DataTable } from "@/components/ui/data-table";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import { parseTableParams, type TableSearchParams } from "@/lib/pagination";
import { fetchActiveLocations, fetchUsersTable } from "@/lib/services/table-queries";

type Props = {
  searchParams: Promise<TableSearchParams>;
};

const ROLE_FILTER_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default async function HqUsersPage({ searchParams }: Props) {
  const params = parseTableParams(await searchParams);
  const [table, locations] = await Promise.all([
    fetchUsersTable(params),
    fetchActiveLocations(),
  ]);

  return (
    <PageShell title="ユーザー管理" description="ロールと拠点の割当">
      <UserForm locations={locations.map((l) => ({ id: l.id, name: l.name }))} />
      <DataTable
        basePath="/hq/users"
        q={params.q}
        filter={params.filter}
        filterLabel="ロール"
        filterOptions={ROLE_FILTER_OPTIONS}
        searchPlaceholder="名前・メールで検索"
        page={table.currentPage}
        totalPages={table.totalPages}
        total={table.total}
        pageSize={params.pageSize}
        rows={table.rows}
        rowKey={(row) => row.id}
        columns={[
          { key: "name", header: "名前", cell: (row) => row.name },
          { key: "email", header: "メール", cell: (row) => row.email },
          { key: "role", header: "ロール", cell: (row) => ROLE_LABELS[row.role] },
          { key: "location", header: "拠点", cell: (row) => row.location?.name ?? "—" },
        ]}
      />
    </PageShell>
  );
}
