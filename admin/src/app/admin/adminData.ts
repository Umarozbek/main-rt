export interface Company {
  id: string;
  name: string;
  description: string;
  website?: string;
  instagram?: string;
  email?: string;
  phones: { number: string; label: string }[];
  slogan?: string;
}

export const DEFAULT_COMPANIES: Company[] = [
  {
    id: 'rtholdings',
    name: 'RT Holdings',
    description: "RT Holdings - bir nechta kompaniyalarni o'z ichiga olgan, O'zbekistonda tashkil topib Janubiy Koreyadan faoliyat ko'rsatuvchi, hamda 15 yildan ko'p vaqtdan beri butun dunyoga maxsus texnikalarni eksport qiluvchi yirik kompaniyadir.",
    website: 'rtholdings.uz',
    instagram: 'rt_holdings',
    email: 'rtholdings2020@gmail.com',
    phones: [
      { number: '+99894-563-9595', label: 'UZ' },
      { number: '+8210-9687-9796', label: 'KR' },
    ],
  },
  {
    id: 'rtmotors',
    name: 'RT Motors',
    description: "2024-yildan buyon Janubiy Koreyadan butun dunyoga yuqori klass avtomobillar eksporti bilan shug'ullanadigan eng yaxshi kompaniyalardan biri.",
    website: 'rt-motors.com',
    instagram: 'rtmotors_trade',
    email: 'rtmotorssales@gmail.com',
    phones: [{ number: '+8210-8465-8085', label: 'KR' }],
  },
  {
    id: 'rtlogistics',
    name: 'RT Logistics',
    description: "Janubiy Koreyadagi tezkor logistika ishlarini amalga oshiruvchi kampaniya. 5 yildan buyon kompaniyamiz markaziy osiyo davlatlariga, shuningdek Rossiya, Belorussiya, Xitoy, Yevropa hamda arab davlatlariga maxsus texnikalarni va avtomobillarni yetkazish bilan shug'ullanib kelmoqda.",
    instagram: 'rt_logistics',
    email: 'rtholdings2020@gmail.com',
    phones: [
      { number: '+99899-011-4177', label: 'UZ' },
      { number: '+8210-9687-9796', label: 'KR' },
    ],
  },
  {
    id: 'dreamexpress',
    name: 'Dream Express',
    description: "Bu kompaniya O'zbekistondagi eng yirik yetkazib beruvchi kompaniya BTS Express bilan hamkorlikda, Janubiy Koreyadagi O'zbekistonlik vatandoshlarni yuklarini, O'zbekistonga oila a'zolariga yetkazib berish bilan shug'ullanadi.",
    instagram: 'expressbts_kr',
    email: 'dreamexpresskr@gmail.com',
    phones: [
      { number: '+8210-2985-8641', label: 'KR' },
      { number: '+8210-2926-8641', label: 'KR' },
    ],
  },
  {
    id: 'kortexoil',
    name: 'Kortex Oil',
    description: "Yangi loyihalarimizdan biri bo'lgan ushbu kompaniyamiz Janubiy Koreyaning eng yetakchilaridan biri bo'lgan World Oil Korea Co., LTD kompaniyasi bilan birgalikda eng sifatli mator moylarini ishlab chiqaradi. Hozirda O'zbekiston, Qozog'iston hamda Qirg'iziston davlatlariga eksport ishlarini boshlagan.",
    instagram: 'kortex_oil',
    email: 'kortexoil.kr@gmail.com',
    phones: [
      { number: '+99894-563-9595', label: 'UZ' },
      { number: '+8210-2989-8641', label: 'KR' },
    ],
  },
  {
    id: 'akataxi',
    name: 'Aka Taxi',
    description: "Ushbu loyiha O'zbekiston ichida shaharlar aro taksi xizmatini taklif qiladi. O'zbekiston aholisini bir manzildan ikkinchi manzilga yetishida yordam beradi.",
    instagram: 'akataxi.uz',
    email: 'akataxi.uz@gmail.com',
    phones: [{ number: '+99899-921-1166', label: 'UZ' }],
  },
  {
    id: 'rtmedline',
    name: 'RT Medline',
    description: "Ko'p tarmoqli oilaviy shifoxona. Ushbu maskanda hozirda 20 dan ortiq malakali shifokorlar 10 ga yaqin yo'nalishda faoliyat ko'rsatib bormoqda.",
    website: 'rtmedline.uz',
    instagram: 'rt_medline',
    email: 'rtmedline@gmail.com',
    phones: [{ number: '+99894-034-2222', label: 'UZ' }],
  },
];

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
  image: string;
}

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: '1',
    title: "Kortex Oil — birinchi konteyner O'zbekistonga yetkazildi",
    date: '2025-05-21',
    content: "Kortex Oil brendi ostida ishlab chiqarilgan birinchi partiya motor moylari O'zbekistonga muvaffaqiyatli yetkazildi.",
    image: '/img/k-barrel.jpg',
  },
  {
    id: '2',
    title: 'World Oil Korea Co., LTD bilan shartnoma imzolandi',
    date: '2025-03-06',
    content: 'RT Holdings va World Oil Korea Co., LTD o\'rtasida rasmiy hamkorlik shartnomasi imzolandi.',
    image: '/img/k-sign.jpg',
  },
];

export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  date: string;
  read: boolean;
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  return fallback;
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function checkAuth(): boolean {
  try {
    return localStorage.getItem('rt-admin-auth') === 'true';
  } catch {
    return false;
  }
}

export function login(username: string, password: string): boolean {
  if (username === 'admin' && password === 'rtholdings2025') {
    try { localStorage.setItem('rt-admin-auth', 'true'); } catch {}
    return true;
  }
  return false;
}

export function logout(): void {
  try { localStorage.removeItem('rt-admin-auth'); } catch {}
}

/* ── Excavator fleet ─────────────────────────────────── */

export interface Excavator {
  id: string;
  brand: string;
  model: string;
  type: string;
  year: string;
  hours: string;
  price: string;
  weight: string;
  power: string;
  bucket: string;
  depth: string;
  image: string;
  status: 'active' | 'sold' | 'reserved';
}

export const DEFAULT_EXCAVATORS: Excavator[] = [
  {
    id: 'volvo-1',
    brand: 'VOLVO',
    model: 'Volvo EW160E',
    type: "G'ildirakli ekskavator",
    year: '2019',
    hours: '4 200',
    price: '',
    weight: '17.5 t',
    power: '122 kVt',
    bucket: '0.92 m³',
    depth: '5.5 m',
    image: '/img/ex-volvo.webp',
    status: 'active',
  },
  {
    id: 'hyundai-1',
    brand: 'HYUNDAI',
    model: 'Hyundai HW160',
    type: "G'ildirakli ekskavator",
    year: '2020',
    hours: '3 800',
    price: '',
    weight: '16.8 t',
    power: '118 kVt',
    bucket: '0.80 m³',
    depth: '5.3 m',
    image: '/img/ex-hyundai.webp',
    status: 'active',
  },
  {
    id: 'doosan-1',
    brand: 'DOOSAN',
    model: 'Doosan DX190W-5',
    type: "G'ildirakli ekskavator",
    year: '2021',
    hours: '2 600',
    price: '',
    weight: '19.0 t',
    power: '127 kVt',
    bucket: '0.93 m³',
    depth: '5.6 m',
    image: '/img/ex-doosan.webp',
    status: 'active',
  },
];
