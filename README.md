# Wine Management System

次世代ワイン管理システム — 店舗・倉庫・本部向け在庫管理プラットフォーム

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Auth.js (NextAuth v5) |
| Database | **PostgreSQL on Supabase** |
| ORM | **Prisma** (pooled `DATABASE_URL` + direct `DIRECT_URL`) |
| Platform | Supabase (DB, Storage, Realtime), Vercel |

```
Next.js  ──►  Prisma  ──►  Supabase PostgreSQL
   │
   └──►  Supabase Client  (Storage / Realtime — future)
```

## Quick Start

### Option A: Supabase Cloud (recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy connection strings from **Project Settings → Database**:
   - **Transaction pooler** → `DATABASE_URL` (port 6543)
   - **Direct connection** → `DIRECT_URL` (port 5432)
3. Copy API keys from **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

```bash
cp .env.example .env   # fill in Supabase values
npm install
npm run db:setup       # prisma db push + seed
npm run dev
```

### Option B: Local PostgreSQL (docker)

For offline dev without Supabase cloud:

```bash
docker compose up -d
cp .env.example .env
# Uncomment the local DATABASE_URL / DIRECT_URL lines in .env
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 店舗 | store@wine.local | password123 |
| 倉庫 | warehouse@wine.local | password123 |
| 本部 | admin@wine.local | password123 |

## Modules

- `/store` — 店舗: 在庫、発注、入荷確認
- `/warehouse` — 倉庫: JAN入庫、ピッキング、在庫
- `/hq` — 本部: 商品/拠点/ユーザー管理、分析

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm run db:push` | スキーマをDBに反映 |
| `npm run db:migrate` | Prisma マイグレーション（Supabase `DIRECT_URL` 使用） |
| `npm run db:seed` | シードデータ投入 |
| `npm run db:setup` | push + seed |

## Supabase + Prisma Notes

- **Runtime queries** (Next.js): use `DATABASE_URL` (PgBouncer pooler, port 6543)
- **Migrations** (`prisma migrate`, `db push`): use `DIRECT_URL` (direct, port 5432)
- **Auth**: Auth.js handles login; Supabase Auth is not used
- **Supabase client** (`lib/supabase/`): ready for Storage (product images) and Realtime (live inventory)

## Documentation

- [DESIGN.md](docs/DESIGN.md) — 設計書
- [TODO.md](docs/TODO.md) — 開発タスク
