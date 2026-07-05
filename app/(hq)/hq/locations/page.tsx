import { PageShell } from "@/app/(hq)/hq/layout";
import { LocationForm } from "@/components/hq/location-form";
import { db } from "@/lib/db";

export default async function HqLocationsPage() {
  const locations = await db.location.findMany({ orderBy: { code: "asc" } });

  return (
    <PageShell title="拠点マスタ" description="店舗・倉庫・本部の管理">
      <LocationForm />
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-600">
            <tr>
              <th className="px-4 py-3">コード</th>
              <th className="px-4 py-3">名称</th>
              <th className="px-4 py-3">種別</th>
              <th className="px-4 py-3">住所</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id} className="border-t border-stone-100">
                <td className="px-4 py-3">{location.code}</td>
                <td className="px-4 py-3">{location.name}</td>
                <td className="px-4 py-3">{location.type}</td>
                <td className="px-4 py-3">{location.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
