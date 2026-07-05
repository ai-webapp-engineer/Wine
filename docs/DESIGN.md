# 次世代ワイン管理システム — 設計ドキュメント

> **Version:** 0.1 (Draft)  
> **Last Updated:** 2026-07-05  
> **Status:** 要件定義・設計フェーズ

---

## 1. プロジェクト概要

### 1.1 目的

ワインの流通・在庫管理をデジタル化し、**店舗・倉庫・本部**の三者間における業務プロセスを最適化する。アナログ管理・Excel依存による情報非対称性と入力ミスを解消し、一気通貫したプラットフォームを構築する。

### 1.2 スコープ

| 領域 | 内容 |
|------|------|
| 店舗 | リアルタイム在庫把握、POS連携、発注・補充依頼 |
| 倉庫 | JANコードによる入出庫管理、ピッキング、在庫移動 |
| 本部 | マスタ管理、権限管理、データ分析・レポート |
| 共通 | 認証・認可、監査ログ、Excel連携 |

### 1.3 非スコープ

- 会計・経理システムとの直接連携
- 配送業者（ヤマト・佐川等）API連携
- 多言語対応（日本語のみ）
- ネイティブモバイルアプリ（PWA / レスポンシブWebで対応）

### 1.4 前提・未確定事項

| 項目 | 状態 | 確認事項 |
|------|------|----------|
| 既存システム | クライアント言及あり（「〜をベースに」） | 既存コード・DB・Excelフォーマットの提供 |
| POS連携先 | 未指定 | POSメーカー、API/Webhook仕様、同期頻度 |
| JANスキャン | 未指定 | カメラ（Web Barcode API） vs ハンドスキャナ（キーボード入力） |
| DB | Supabase (PostgreSQL) + Prisma | マネージド Postgres、Storage/Realtime 拡張可能 |
| ユーザー数 | 未指定 | 同時接続数、店舗数、SKU数 |

---

## 2. システムアーキテクチャ

### 2.1 全体構成

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)                 │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ Store UI    │  │ Warehouse UI│  │ HQ Dashboard│  │  │
│  │  │ /store/*    │  │ /warehouse/*│  │ /hq/*       │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │  │
│  │         └────────────────┼────────────────┘         │  │
│  │                          │                           │  │
│  │              ┌───────────▼───────────┐               │  │
│  │              │  API Routes / Server  │               │  │
│  │              │  Actions + Middleware │               │  │
│  │              └───────────┬───────────┘               │  │
│  └──────────────────────────┼───────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
        │ Supabase  │   │ POS System│   │  Vercel   │
        │ PostgreSQL│   │ (Webhook) │   │  Deploy   │
        └───────────┘   └───────────┘   └───────────┘
```

### 2.2 技術スタック

| レイヤ | 技術 | 選定理由 |
|--------|------|----------|
| Framework | Next.js 15 (App Router) | SSR/SSG、API Routes統合、Vercel最適化 |
| Language | TypeScript (strict) | 型安全、大規模保守性 |
| UI | React 19 + Tailwind CSS | コンポーネント再利用、高速スタイリング |
| UI Components | shadcn/ui + Radix UI | アクセシビリティ、カスタマイズ性 |
| Grid | TanStack Table + カスタムセル編集 | Excelライク操作 |
| Barcode | @zxing/browser または html5-qrcode | モバイルJANスキャン |
| ORM | Prisma | 型安全なDB操作、Supabase PostgreSQL 連携 |
| Database | Supabase (PostgreSQL) | マネージド Postgres、バックアップ、Storage/Realtime |
| Supabase SDK | @supabase/supabase-js | Storage・Realtime 等（将来拡張） |
| Auth | NextAuth.js v5 (Auth.js) | ロールベース認可、セッション管理 |
| Validation | Zod | API入出力・フォームバリデーション |
| State | React Server Components + SWR | サーバー状態優先、クライアントキャッシュ |
| Testing | Vitest + Playwright | ユニット + E2E |
| CI/CD | GitHub Actions → Vercel | PRベースデプロイ |
| Monitoring | Vercel Analytics + Sentry (任意) | エラー追跡 |

### 2.3 ディレクトリ構成（案）

```
wine/
├── app/
│   ├── (auth)/                 # ログイン・パスワードリセット
│   ├── (store)/store/          # 店舗向け画面
│   ├── (warehouse)/warehouse/  # 倉庫向け画面
│   ├── (hq)/hq/                # 本部向け画面
│   └── api/                    # REST API / Webhook
├── components/
│   ├── ui/                     # shadcn/ui プリミティブ
│   ├── grid/                   # Excelライクグリッド
│   ├── scanner/                # JANスキャンUI
│   └── layout/                 # ロール別レイアウト
├── lib/
│   ├── db/                     # Prisma client
│   ├── supabase/               # Supabase client (Storage, Realtime)
│   ├── auth/                   # 認証・認可ヘルパー
│   ├── services/               # ビジネスロジック
│   └── validators/             # Zod スキーマ
├── prisma/
│   └── schema.prisma
├── tests/
│   ├── unit/
│   └── e2e/
└── docs/
    ├── DESIGN.md
    └── TODO.md
```

---

## 3. ユーザー・権限設計

### 3.1 ロール定義

| ロール | コード | 説明 |
|--------|--------|------|
| 店舗スタッフ | `STORE_STAFF` | 自店舗の在庫閲覧・発注・棚卸 |
| 店舗管理者 | `STORE_MANAGER` | 店舗スタッフ権限 + 承認・設定 |
| 倉庫担当 | `WAREHOUSE_STAFF` | 入出庫・ピッキング・在庫移動 |
| 倉庫管理者 | `WAREHOUSE_MANAGER` | 倉庫担当権限 + 承認 |
| 本部スタッフ | `HQ_STAFF` | マスタ閲覧・レポート |
| 本部管理者 | `HQ_ADMIN` | 全権限・ユーザー管理 |

### 3.2 権限マトリクス（主要機能）

| 機能 | STORE | WH | HQ |
|------|:-----:|:--:|:--:|
| 自店舗在庫閲覧 | R | - | R |
| 倉庫在庫閲覧 | - | R | R |
| 全拠点在庫閲覧 | - | - | R |
| 入庫登録（JAN） | - | W | - |
| 出庫・ピッキング | - | W | - |
| 店舗発注 | W | - | R |
| 自動補充設定 | - | - | W |
| 商品マスタ管理 | - | - | W |
| ユーザー管理 | - | - | W |
| 分析レポート | - | - | R |
| POS連携設定 | - | - | W |

> R = Read, W = Write

### 3.3 認証フロー

1. メール + パスワードログイン（初期）
2. セッションに `userId`, `role`, `locationId` を保持
3. Middleware でルート `/store/*`, `/warehouse/*`, `/hq/*` をロールでガード
4. API レイヤでも二重チェック（Defense in Depth）

---

## 4. ドメインモデル

### 4.1 ER図（概念）

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Location │     │  Product │     │   User   │
│ (拠点)   │     │ (商品)   │     │          │
└────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │
     │         ┌──────▼──────┐         │
     └────────►│  Inventory  │◄────────┘
               │  (在庫)     │
               └──────┬──────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
   ┌──────▼─────┐ ┌───▼────┐ ┌───▼────────┐
   │StockMovement│ │ Order  │ │PosTransaction│
   │(入出庫履歴) │ │(発注)  │ │(POS売上)    │
   └────────────┘ └────────┘ └────────────┘
```

### 4.2 主要エンティティ

#### Location（拠点）
| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | UUID | PK |
| code | string | 拠点コード（例: ST001, WH001） |
| name | string | 拠点名 |
| type | enum | `STORE` / `WAREHOUSE` / `HQ` |
| address | string? | 住所 |
| isActive | boolean | 有効フラグ |

#### Product（商品 / ワイン）
| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | UUID | PK |
| janCode | string | JANコード（13桁、ユニーク） |
| name | string | 商品名 |
| nameKana | string? | カナ |
| vintage | int? | ヴィンテージ年 |
| producer | string? | 生産者 |
| region | string? | 産地 |
| grape | string? | ブドウ品種 |
| volume | int | 容量(ml) |
| unitPrice | decimal | 販売単価 |
| costPrice | decimal? | 原価 |
| category | string? | カテゴリ（赤/白/スパークリング等） |
| minStock | int | 最低在庫数（自動補充トリガー） |
| isActive | boolean | 販売中フラグ |

#### Inventory（在庫）
| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | UUID | PK |
| locationId | UUID | FK → Location |
| productId | UUID | FK → Product |
| quantity | int | 現在庫数 |
| reservedQty | int | 引当数（ピッキング中） |
| updatedAt | datetime | 最終更新 |

> **制約:** `(locationId, productId)` ユニーク

#### StockMovement（入出庫履歴）
| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | UUID | PK |
| type | enum | `INBOUND` / `OUTBOUND` / `TRANSFER` / `ADJUSTMENT` / `POS_SALE` |
| fromLocationId | UUID? | 出庫元 |
| toLocationId | UUID? | 入庫先 |
| productId | UUID | FK → Product |
| quantity | int | 数量（正数） |
| referenceNo | string? | 伝票番号 |
| scannedJan | string? | スキャンしたJAN |
| userId | UUID | 操作者 |
| note | string? | 備考 |
| createdAt | datetime | 操作日時 |

#### Order（発注）
| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | UUID | PK |
| orderNo | string | 発注番号 |
| fromLocationId | UUID | 発注元（店舗） |
| toLocationId | UUID | 出荷元（倉庫） |
| status | enum | `DRAFT` / `SUBMITTED` / `PICKING` / `SHIPPED` / `RECEIVED` / `CANCELLED` |
| items | OrderItem[] | 明細 |
| requestedBy | UUID | 発注者 |
| approvedBy | UUID? | 承認者 |
| createdAt | datetime | 発注日 |

#### PosTransaction（POS売上）
| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | UUID | PK |
| externalId | string | POS側トランザクションID |
| locationId | UUID | 店舗 |
| productId | UUID | 商品 |
| quantity | int | 販売数 |
| unitPrice | decimal | 販売単価 |
| soldAt | datetime | 販売日時 |
| syncedAt | datetime | 同期日時 |

---

## 5. 機能設計

### 5.1 店舗モジュール (`/store`)

| 機能 | 説明 | 優先度 |
|------|------|--------|
| ダッシュボード | 在庫サマリ、低在庫アラート、本日の売上 | P0 |
| 在庫一覧 | 自店舗SKU別在庫、検索・フィルタ | P0 |
| 発注作成 | 商品選択 → 数量入力 → 倉庫へ送信 | P0 |
| 入荷確認 | 倉庫からの出荷を受領確認 | P1 |
| 棚卸 | 実在庫入力 → 差異調整 | P1 |
| 売上履歴 | POS連携売上の閲覧 | P1 |

**UX要件:**
- タブレット対応（768px以上）
- 在庫一覧はページネーション + 検索
- 発注はExcelライクグリッドで複数SKU一括入力

### 5.2 倉庫モジュール (`/warehouse`)

| 機能 | 説明 | 優先度 |
|------|------|--------|
| 入庫スキャン | JANスキャン → 数量確認 → 入庫登録 | P0 |
| 出庫・ピッキング | 発注に基づくピッキングリスト → JAN確認 → 出庫 | P0 |
| 在庫一覧 | 倉庫SKU別在庫 | P0 |
| 在庫移動 | 倉庫間・店舗への移動 | P1 |
| 入出庫履歴 | 操作ログ閲覧 | P1 |

**UX要件:**
- **モバイルファースト**（375px基準）
- JANスキャン: カメラ起動 → 連続スキャンモード
- ハンドスキャナ: フォーカス常時入力フィールド
- 大きなタップターゲット（最小 48px）
- オフライン時のキューイング（将来拡張）

### 5.3 本部モジュール (`/hq`)

| 機能 | 説明 | 優先度 |
|------|------|--------|
| ダッシュボード | 全拠点在庫サマリ、KPI | P0 |
| 商品マスタ | CRUD、JAN紐付け、Excel一括インポート | P0 |
| 拠点マスタ | 店舗・倉庫の登録管理 | P0 |
| ユーザー管理 | ロール・拠点割当 | P0 |
| 発注管理 | 全発注のステータス管理 | P1 |
| 自動補充設定 | 最低在庫閾値、補充ルール | P1 |
| 分析レポート | 売上推移、在庫回転率、ABC分析 | P2 |
| POS連携設定 | Webhook URL、同期設定 | P1 |

**UX要件:**
- デスクトップ最適化（1280px以上）
- 商品マスタはExcelライクグリッド（インライン編集、コピペ対応）
- レポートはCSV/Excelエクスポート

### 5.4 POS連携

```
POS System                    Wine Platform
    │                              │
    │  POST /api/pos/webhook       │
    │  { externalId, storeId,      │
    │    items: [{jan, qty, price}]│
    │  }                           │
    ├─────────────────────────────►│
    │                              ├─ 商品JAN → Product 解決
    │                              ├─ Inventory 減算
    │                              ├─ PosTransaction 記録
    │                              ├─ StockMovement 記録
    │                              └─ 低在庫チェック → 通知
    │  200 OK                      │
    │◄─────────────────────────────┤
```

**同期方式（要確認）:**
- **Push (Webhook):** POS → 本システム（推奨、リアルタイム）
- **Pull (Polling):** 本システム → POS API（定期バッチ）
- **初期:** Webhook + 手動CSVインポートのフォールバック

### 5.5 自動補充ロジック

```
トリガー: 在庫更新時（POS売上 / 出庫 / 棚卸）
  │
  ├─ inventory.quantity <= product.minStock ?
  │     YES → 自動発注ドラフト生成
  │           quantity = max(minStock * 2 - current, 1)
  │           status = DRAFT (本部承認待ち or 自動SUBMIT)
  │     NO  → 何もしない
  │
  └─ 通知: 店舗管理者 + 本部に低在庫アラート
```

---

## 6. API設計（主要エンドポイント）

### 6.1 認証
| Method | Path | 説明 |
|--------|------|------|
| POST | `/api/auth/login` | ログイン |
| POST | `/api/auth/logout` | ログアウト |

### 6.2 在庫
| Method | Path | 説明 | ロール |
|--------|------|------|--------|
| GET | `/api/inventory?locationId=` | 在庫一覧 | ALL |
| GET | `/api/inventory/:productId` | SKU別在庫（全拠点） | HQ |
| PATCH | `/api/inventory/adjust` | 棚卸調整 | STORE, WH |

### 6.3 入出庫
| Method | Path | 説明 | ロール |
|--------|------|------|--------|
| POST | `/api/stock/inbound` | 入庫登録 | WH |
| POST | `/api/stock/outbound` | 出庫登録 | WH |
| POST | `/api/stock/transfer` | 在庫移動 | WH, HQ |
| GET | `/api/stock/movements` | 入出庫履歴 | ALL |

### 6.4 発注
| Method | Path | 説明 | ロール |
|--------|------|------|--------|
| GET | `/api/orders` | 発注一覧 | ALL |
| POST | `/api/orders` | 発注作成 | STORE |
| PATCH | `/api/orders/:id/status` | ステータス更新 | WH, HQ |
| GET | `/api/orders/:id/picking-list` | ピッキングリスト | WH |

### 6.5 商品・マスタ
| Method | Path | 説明 | ロール |
|--------|------|------|--------|
| GET | `/api/products` | 商品一覧 | ALL |
| POST | `/api/products` | 商品登録 | HQ |
| PUT | `/api/products/:id` | 商品更新 | HQ |
| POST | `/api/products/import` | Excel一括インポート | HQ |
| GET | `/api/products/by-jan/:janCode` | JAN検索 | ALL |

### 6.6 POS
| Method | Path | 説明 | ロール |
|--------|------|------|--------|
| POST | `/api/pos/webhook` | POS売上受信 | System |
| GET | `/api/pos/transactions` | 売上履歴 | STORE, HQ |

### 6.7 分析
| Method | Path | 説明 | ロール |
|--------|------|------|--------|
| GET | `/api/analytics/dashboard` | KPIダッシュボード | HQ |
| GET | `/api/analytics/inventory-turnover` | 在庫回転率 | HQ |
| GET | `/api/analytics/export` | CSV/Excelエクスポート | HQ |

---

## 7. UI/UX設計方針

### 7.1 デザイン原則

1. **現場ファースト:** 店舗・倉庫スタッフが迷わず操作できる
2. **入力最小化:** スキャン・自動補完・デフォルト値で手入力を減らす
3. **即時フィードバック:** 操作結果を Toast / インライン表示
4. **エラー防止:** 確認ダイアログ、Undo可能な操作

### 7.2 画面別レイアウト

| モジュール | レイアウト | ナビ |
|-----------|-----------|------|
| 店舗 | サイドバー + メイン | 在庫 / 発注 / 棚卸 / 売上 |
| 倉庫 | ボトムナビ（モバイル） | スキャン / ピッキング / 在庫 / 履歴 |
| 本部 | サイドバー + メイン | ダッシュボード / マスタ / 発注 / 分析 / 設定 |

### 7.3 Excelライクグリッド仕様

- セルクリック → インライン編集
- Tab / Enter でセル移動
- Ctrl+C/V でコピペ（TSV形式）
- 行追加・削除
- ソート・フィルタ
- バリデーションエラーはセル単位で赤枠 + ツールチップ

### 7.4 JANスキャンUI仕様

- カメラビュー fullscreen（倉庫モバイル）
- スキャン成功 → 短い振動（Vibration API）+ 音声フィードバック
- 連続スキャンモード: 同一JAN連続読取で数量自動インクリメント
- 未知JAN → 「未登録商品」警告 + 手動登録リンク
- スキャン履歴（直近10件）をリスト表示

---

## 8. 非機能要件

| 項目 | 目標 |
|------|------|
| ページ読込 | LCP < 2.5s |
| API応答 | p95 < 500ms |
| 同時ユーザー | 50+ (初期) |
| 可用性 | 99.5% (Vercel SLA) |
| データ整合性 | 在庫操作はトランザクション + 楽観ロック |
| セキュリティ | HTTPS, CSRF, ロールガード, 監査ログ |
| バックアップ | Supabase 自動バックアップ（Pro plan） |

---

## 9. テスト戦略

| レイヤ | ツール | 対象 |
|--------|--------|------|
| Unit | Vitest | services, validators, utils |
| Integration | Vitest + test DB | API routes, DB操作 |
| E2E | Playwright | ログイン → 入庫スキャン → 在庫確認 |
| 手動 | チェックリスト | JANスキャン実機、POS連携 |

**カバレッジ目標:** ビジネスロジック 80%+

---

## 10. デプロイ・環境

| 環境 | URL | 用途 |
|------|-----|------|
| Development | localhost:3000 | ローカル開発 |
| Preview | *.vercel.app | PRごと自動デプロイ |
| Production | (要決定) | 本番 |

**環境変数:**
```
DATABASE_URL=          # Supabase pooler (port 6543, pgbouncer=true)
DIRECT_URL=            # Supabase direct (port 5432, for migrations)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AUTH_SECRET=
AUTH_URL=
POS_WEBHOOK_SECRET=
```

---

## 11. リスクと対策

| リスク | 影響 | 対策 |
|--------|------|------|
| 既存データ移行 | 高 | 早期にExcel/既存DBフォーマット確認、移行スクリプト |
| POS API仕様未確定 | 高 | Webhook + CSVフォールバックを初期実装 |
| JANコード重複・未登録 | 中 | マスタ整備を先行、未知JANハンドリング |
| 在庫不整合 | 高 | トランザクション + 監査ログ + 定期リコンシリエーション |
| モバイルスキャン精度 | 中 | ハンドスキャナ対応を並行、照明条件テスト |

---

## 12. 用語集

| 用語 | 説明 |
|------|------|
| JANコード | 日本の商品バーコード標準（13桁） |
| SKU | Stock Keeping Unit（在庫管理単位） |
| ピッキング | 出荷のための商品取り出し作業 |
| ヴィンテージ | ワインの製造年 |
| POS | Point of Sale（レジ・販売端末） |
| RBAC | Role-Based Access Control（ロールベースアクセス制御） |

---

## 改訂履歴

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-07-05 | - | 初版ドラフト |
