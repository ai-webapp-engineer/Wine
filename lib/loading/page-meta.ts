import type { FilterOption } from "@/components/ui/data-table-toolbar";
import { ORDER_STATUS_LABELS } from "@/lib/services/table-queries";

const STATUS_FILTER_OPTIONS: FilterOption[] = Object.entries(ORDER_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export type DashboardPageMeta = {
  kind: "dashboard";
  title: string;
  description: string;
  statCount: number;
};

export type TablePageMeta = {
  kind: "table";
  title: string;
  description: string;
  basePath: string;
  columns: string[];
  searchPlaceholder?: string;
  filterLabel?: string;
  filterOptions?: FilterOption[];
};

export type ContentPageMeta = {
  kind: "content";
  title: string;
  description?: string;
};

export type PageMeta = DashboardPageMeta | TablePageMeta | ContentPageMeta;

const PAGE_META: Record<string, PageMeta> = {
  "/hq": { kind: "dashboard", title: "本部ダッシュボード", description: "全社KPIサマリ", statCount: 6 },
  "/hq/products": {
    kind: "table",
    title: "商品マスタ",
    description: "ワイン商品の登録・編集",
    basePath: "/hq/products",
    columns: ["商品名", "JAN", "カテゴリ", "単価", "最低在庫"],
    searchPlaceholder: "商品名・JAN・カテゴリで検索",
    filterLabel: "カテゴリ",
  },
  "/hq/locations": {
    kind: "table",
    title: "拠点マスタ",
    description: "店舗・倉庫・本部の管理",
    basePath: "/hq/locations",
    columns: ["コード", "名称", "種別", "住所"],
    searchPlaceholder: "コード・名称・住所で検索",
    filterLabel: "種別",
    filterOptions: [
      { value: "STORE", label: "店舗" },
      { value: "WAREHOUSE", label: "倉庫" },
      { value: "HQ", label: "本部" },
    ],
  },
  "/hq/inventory": {
    kind: "table",
    title: "全拠点在庫",
    description: "店舗・倉庫横断の在庫一覧",
    basePath: "/hq/inventory",
    columns: ["拠点", "商品名", "JAN", "在庫"],
    searchPlaceholder: "拠点・商品名・JANで検索",
    filterLabel: "拠点",
  },
  "/hq/orders": {
    kind: "table",
    title: "発注管理",
    description: "全店舗の発注状況",
    basePath: "/hq/orders",
    columns: ["発注番号", "ルート", "日付", "ステータス", "SKU数", "合計数量"],
    searchPlaceholder: "発注番号・店舗・倉庫で検索",
    filterLabel: "ステータス",
    filterOptions: STATUS_FILTER_OPTIONS,
  },
  "/hq/users": {
    kind: "table",
    title: "ユーザー管理",
    description: "ロールと拠点の割当",
    basePath: "/hq/users",
    columns: ["名前", "メール", "ロール", "拠点"],
    searchPlaceholder: "名前・メールで検索",
    filterLabel: "ロール",
  },
  "/store": {
    kind: "dashboard",
    title: "店舗ダッシュボード",
    description: "自店舗の在庫と発注状況",
    statCount: 3,
  },
  "/store/inventory": {
    kind: "table",
    title: "在庫一覧",
    description: "自店舗のSKU別在庫",
    basePath: "/store/inventory",
    columns: ["商品名", "JAN", "在庫", "最低在庫", "単価"],
    searchPlaceholder: "商品名・JAN・カテゴリで検索",
    filterLabel: "在庫状態",
    filterOptions: [{ value: "low", label: "最低在庫以下" }],
  },
  "/store/orders": {
    kind: "table",
    title: "発注",
    description: "倉庫への発注作成と履歴",
    basePath: "/store/orders",
    columns: ["発注番号", "出荷倉庫", "日付", "ステータス", "SKU数", "合計数量"],
    searchPlaceholder: "発注番号・倉庫名で検索",
    filterLabel: "ステータス",
    filterOptions: STATUS_FILTER_OPTIONS,
  },
  "/store/receiving": {
    kind: "content",
    title: "入荷確認",
    description: "倉庫からの出荷を受領",
  },
  "/warehouse": {
    kind: "dashboard",
    title: "倉庫ダッシュボード",
    description: "入出庫とピッキング",
    statCount: 5,
  },
  "/warehouse/inventory": {
    kind: "table",
    title: "倉庫在庫",
    description: "倉庫SKU別在庫",
    basePath: "/warehouse/inventory",
    columns: ["商品名", "JAN", "在庫", "引当"],
    searchPlaceholder: "商品名・JAN・カテゴリで検索",
    filterLabel: "在庫状態",
    filterOptions: [{ value: "low", label: "最低在庫以下" }],
  },
  "/warehouse/inbound": {
    kind: "content",
    title: "入庫スキャン",
    description: "JANコードで入庫登録",
  },
  "/warehouse/picking": {
    kind: "content",
    title: "ピッキング",
    description: "発注に基づく出庫",
  },
};

export function getPageMeta(pathname: string): PageMeta {
  const normalized = pathname.replace(/\/$/, "") || pathname;
  return (
    PAGE_META[normalized] ?? {
      kind: "content",
      title: "読み込み中",
      description: undefined,
    }
  );
}
