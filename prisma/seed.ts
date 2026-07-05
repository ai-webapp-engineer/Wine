import bcrypt from "bcryptjs";
import {
  LocationType,
  OrderStatus,
  PrismaClient,
  UserRole,
} from "@prisma/client";

const db = new PrismaClient();

const WINES = [
  { name: "シャトー・マルゴー", producer: "ボルドー", region: "フランス", category: "赤", vintage: 2018 },
  { name: "ドメーヌ・ルフレーヴ", producer: "ルフレーヴ", region: "ブルゴーニュ", category: "白", vintage: 2020 },
  { name: "オーパス・ワン", producer: "オーパス・ワン", region: "ナパ", category: "赤", vintage: 2019 },
  { name: "ドン・ペリニヨン", producer: "モエ", region: "シャンパーニュ", category: "スパークリング", vintage: 2015 },
  { name: "ペンフォールズ・グランジ", producer: "ペンフォールズ", region: "オーストラリア", category: "赤", vintage: 2017 },
];

async function main() {
  await db.posTransaction.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.stockMovement.deleteMany();
  await db.inventory.deleteMany();
  await db.product.deleteMany();
  await db.user.deleteMany();
  await db.location.deleteMany();

  const store = await db.location.create({
    data: {
      code: "ST001",
      name: "銀座店",
      type: LocationType.STORE,
      address: "東京都中央区銀座1-1-1",
    },
  });

  const warehouse = await db.location.create({
    data: {
      code: "WH001",
      name: "東京倉庫",
      type: LocationType.WAREHOUSE,
      address: "東京都江東区",
    },
  });

  const hq = await db.location.create({
    data: {
      code: "HQ001",
      name: "本部",
      type: LocationType.HQ,
      address: "東京都港区",
    },
  });

  const passwordHash = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    db.user.create({
      data: {
        email: "store@wine.local",
        name: "店舗 太郎",
        role: UserRole.STORE_STAFF,
        locationId: store.id,
        passwordHash,
      },
    }),
    db.user.create({
      data: {
        email: "store.manager@wine.local",
        name: "店舗 管理者",
        role: UserRole.STORE_MANAGER,
        locationId: store.id,
        passwordHash,
      },
    }),
    db.user.create({
      data: {
        email: "warehouse@wine.local",
        name: "倉庫 花子",
        role: UserRole.WAREHOUSE_STAFF,
        locationId: warehouse.id,
        passwordHash,
      },
    }),
    db.user.create({
      data: {
        email: "warehouse.manager@wine.local",
        name: "倉庫 管理者",
        role: UserRole.WAREHOUSE_MANAGER,
        locationId: warehouse.id,
        passwordHash,
      },
    }),
    db.user.create({
      data: {
        email: "hq@wine.local",
        name: "本部 次郎",
        role: UserRole.HQ_STAFF,
        locationId: hq.id,
        passwordHash,
      },
    }),
    db.user.create({
      data: {
        email: "admin@wine.local",
        name: "本部 管理者",
        role: UserRole.HQ_ADMIN,
        locationId: hq.id,
        passwordHash,
      },
    }),
  ]);

  const products = [];
  for (let i = 1; i <= 50; i += 1) {
    const template = WINES[i % WINES.length];
    const janCode = `4901234${String(i).padStart(5, "0")}`;
    products.push(
      await db.product.create({
        data: {
          janCode,
          name: `${template.name} ${2015 + (i % 8)}`,
          nameKana: `ワイン${i}`,
          producer: template.producer,
          region: template.region,
          category: template.category,
          vintage: template.vintage,
          volume: 750,
          unitPrice: 3000 + i * 120,
          costPrice: 1800 + i * 80,
          minStock: 5 + (i % 3),
        },
      }),
    );
  }

  for (const product of products) {
    await db.inventory.create({
      data: {
        locationId: warehouse.id,
        productId: product.id,
        quantity: 20 + (product.unitPrice.toNumber() % 30),
      },
    });

    await db.inventory.create({
      data: {
        locationId: store.id,
        productId: product.id,
        quantity: 3 + (product.minStock % 5),
      },
    });
  }

  const order = await db.order.create({
    data: {
      orderNo: "ORD-SEED-0001",
      fromLocationId: store.id,
      toLocationId: warehouse.id,
      status: OrderStatus.SUBMITTED,
      requestedById: users[0].id,
      items: {
        create: products.slice(0, 3).map((product) => ({
          productId: product.id,
          quantity: 6,
        })),
      },
    },
  });

  console.log("Seed complete");
  console.log("Demo password for all users: password123");
  console.log("Store user:", users[0].email);
  console.log("Warehouse user:", users[2].email);
  console.log("HQ admin:", users[5].email);
  console.log("Sample order:", order.orderNo);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
