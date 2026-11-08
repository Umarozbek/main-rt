import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed admin user
  const adminEmail = 'admin@rtholdings.uz';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash('rtholdings2025', 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hash,
        name: 'Admin',
        role: 'SUPER_ADMIN',
      },
    });
    console.log('Admin user created: admin@rtholdings.uz');
  }

  // Seed companies
  const companies = [
    {
      slug: 'rtholdings',
      nameUz: 'RT Holdings',
      descUz: "RT Holdings - bir nechta kompaniyalarni o'z ichiga olgan, O'zbekistonda tashkil topib Janubiy Koreyadan faoliyat ko'rsatuvchi, hamda 15 yildan ko'p vaqtdan beri butun dunyoga maxsus texnikalarni eksport qiluvchi yirik kompaniyadir.",
      website: 'https://www.rtholdings.uz',
      instagram: 'rt_holdings',
      email: 'rtholdings2020@gmail.com',
      phone: '+998945639595',
      sortOrder: 0,
    },
    {
      slug: 'kortex-oil',
      nameUz: 'Kortex Oil',
      descUz: "Yangi loyihalarimizdan biri bo'lgan ushbu kompaniyamiz Janubiy Koreyaning eng yetakchilaridan biri bo'lgan World Oil Korea Co., LTD kompaniyasi bilan birgalikda eng sifatli mator moylarini ishlab chiqaradi.",
      instagram: 'kortex_oil',
      email: 'kortexoil.kr@gmail.com',
      phone: '+998945639595',
      sortOrder: 1,
    },
    {
      slug: 'dream-express',
      nameUz: 'Dream Express',
      descUz: "Bu kompaniya O'zbekistondagi eng yirik yetkazib beruvchi kompaniya BTS Express bilan hamkorlikda, Janubiy Koreyadagi O'zbekistonlik vatandoshlarni yuklarini yetkazib berish bilan shug'ullanadi.",
      instagram: 'expressbts_kr',
      email: 'dreamexpresskr@gmail.com',
      phone: '+82102985864',
      sortOrder: 2,
    },
    {
      slug: 'rt-motors',
      nameUz: 'RT Motors',
      descUz: "2024-yildan buyon Janubiy Koreyadan butun dunyoga yuqori klass avtomobillar eksporti bilan shug'ullanadigan eng yaxshi kompaniyalardan biri.",
      instagram: 'rtmotors_trade',
      email: 'rtmotorssales@gmail.com',
      phone: '+821084658085',
      sortOrder: 3,
    },
    {
      slug: 'rt-medline',
      nameUz: 'RT Medline',
      descUz: "Ko'p tarmoqli oilaviy shifoxona. Ushbu maskanda hozirda 20 dan ortiq malakali shifokorlar 10 ga yaqin yo'nalishda faoliyat ko'rsatib bormoqda.",
      website: 'https://rtmedlineuz.com',
      instagram: 'rt_medline',
      email: 'rtmedline@gmail.com',
      phone: '+998940342222',
      sortOrder: 4,
    },
    {
      slug: 'aka-taxi',
      nameUz: 'Aka Taxi',
      descUz: "Ushbu loyiha O'zbekiston ichida shaharlar aro taksi xizmatini taklif qiladi.",
      instagram: 'akataxi.uz',
      telegram: 'akataxi',
      email: 'akataxi.uz@gmail.com',
      phone: '+998999211166',
      sortOrder: 5,
    },
    {
      slug: 'rt-logistics',
      nameUz: 'RT Logistics',
      descUz: "Janubiy Koreyadagi tezkor logistika ishlarini amalga oshiruvchi kampaniya.",
      instagram: 'rt_logistics',
      email: 'rtholdings2020@gmail.com',
      phone: '+998990114177',
      sortOrder: 6,
    },
  ];

  for (const c of companies) {
    await prisma.company.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log(`Seeded ${companies.length} companies`);

  // Seed fleet items
  const fleet = [
    {
      brand: 'VOLVO',
      model: 'Volvo EW160E',
      type: "G'ildirakli ekskavator",
      imageUrl: '/img/ex-volvo.webp',
      weight: '17.5 t',
      power: '122 kVt',
      bucket: '0.92 m³',
      digDepth: '5.5 m',
      year: '2019',
      hours: '4 200',
      sortOrder: 0,
    },
    {
      brand: 'HYUNDAI',
      model: 'Hyundai HW160',
      type: "G'ildirakli ekskavator",
      imageUrl: '/img/ex-hyundai.webp',
      weight: '16.8 t',
      power: '118 kVt',
      bucket: '0.80 m³',
      digDepth: '5.3 m',
      year: '2020',
      hours: '3 800',
      sortOrder: 1,
    },
    {
      brand: 'DOOSAN',
      model: 'Doosan DX190W-5',
      type: "G'ildirakli ekskavator",
      imageUrl: '/img/ex-doosan.webp',
      weight: '19.0 t',
      power: '127 kVt',
      bucket: '0.93 m³',
      digDepth: '5.6 m',
      year: '2021',
      hours: '2 600',
      sortOrder: 2,
    },
  ];

  const existingFleet = await prisma.fleetItem.count();
  if (existingFleet === 0) {
    for (const f of fleet) {
      await prisma.fleetItem.create({ data: f });
    }
    console.log(`Seeded ${fleet.length} fleet items`);
  }

  // Seed news
  const existingNews = await prisma.newsArticle.count();
  if (existingNews === 0) {
    await prisma.newsArticle.create({
      data: {
        titleUz: "Kortex Oil — birinchi konteyner O'zbekistonga yetkazildi",
        bodyUz: "Kortex Oil brendi ostida ishlab chiqarilgan birinchi partiya motor moylari O'zbekistonga muvaffaqiyatli yetkazildi.",
        imageUrl: '/img/k-barrel.jpg',
        company: 'kortex-oil',
        publishDate: new Date('2025-05-21'),
        sortOrder: 0,
      },
    });
    await prisma.newsArticle.create({
      data: {
        titleUz: 'World Oil Korea Co., LTD bilan shartnoma imzolandi',
        bodyUz: "RT Holdings va World Oil Korea Co., LTD o'rtasida rasmiy hamkorlik shartnomasi imzolandi.",
        imageUrl: '/img/k-sign.jpg',
        company: 'kortex-oil',
        publishDate: new Date('2025-03-06'),
        sortOrder: 1,
      },
    });
    console.log('Seeded 2 news articles');
  }

  // Seed site settings
  const settings = [
    { key: 'phone_uz', value: '+998 94 563 95 95' },
    { key: 'phone_kr', value: '+82 10 9687 9796' },
    { key: 'email', value: 'rtholdingsgroup@gmail.com' },
    { key: 'location', value: 'Janubiy Koreya' },
    { key: 'telegram', value: 'https://t.me/rtholdings' },
    { key: 'whatsapp', value: 'https://wa.me/998945639595' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`Seeded ${settings.length} site settings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
