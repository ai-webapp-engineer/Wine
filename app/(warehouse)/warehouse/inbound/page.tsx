import { PageShell } from "@/app/(warehouse)/warehouse/layout";
import { WarehouseInboundClient } from "@/components/warehouse/inbound-client";

export default function WarehouseInboundPage() {
  return (
    <PageShell title="入庫スキャン" description="JANコードで入庫登録">
      <WarehouseInboundClient />
    </PageShell>
  );
}
