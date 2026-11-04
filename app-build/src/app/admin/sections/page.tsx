'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import AdminShell from '../AdminShell';
import { DEFAULT_COMPANIES, DEFAULT_EXCAVATORS, loadFromStorage, saveToStorage, type Company, type Excavator } from '../adminData';
import s from '../admin.module.css';

import uzJson from '../../../../../messages/uz.json';
import ruJson from '../../../../../messages/ru.json';
import enJson from '../../../../../messages/en.json';

type Dict = Record<string, string>;

/* ── Section definitions (keys match messages/*.json exactly) ── */

interface ImageDef {
  file: string;
  label: string;
  size: string;
  tip: string;
}

interface TextDef {
  key: string;
  label: string;
}

interface SectionDef {
  id: string;
  num: string;
  title: string;
  color: string;
  desc: string;
  images: ImageDef[];
  texts: TextDef[];
  companies?: string[];
}

const SECTIONS: SectionDef[] = [
  {
    id: 'header', num: '01', title: 'Sarlavha va menyu', color: '#6366F1',
    desc: 'Sahifa yuqorisidagi logo, navigatsiya havolalari va til tanlash tugmasi.',
    images: [
      { file: 'rt-logo.png', label: 'Logo (qora fon uchun)', size: '720×296 PNG', tip: 'Shaffof orqa fonli. Oq sahifa ustida ko\'rinadi.' },
      { file: 'rt-logo-white.png', label: 'Logo (oq)', size: '720×296 PNG', tip: 'Shaffof orqa fonli. To\'q fon ustida ko\'rinadi.' },
    ],
    texts: [
      { key: 'nAbout', label: 'Menyu: Biz haqimizda' },
      { key: 'nCargo', label: 'Menyu: Cargo' },
      { key: 'nAka', label: 'Menyu: aka taxi' },
      { key: 'nNews', label: 'Menyu: Yangiliklar' },
      { key: 'nContact', label: 'Menyu: Aloqa' },
      { key: 'nCos', label: 'Menyu: Kompaniyalar' },
    ],
  },
  {
    id: 'hero', num: '02', title: 'Hero slayder', color: '#C9A26B',
    desc: '4 ta slayd: Eksport ekskavatorlar, Import Kortex Oil, Logistika kema, Kargo yuk mashinasi.',
    images: [
      { file: 'ex-volvo.webp', label: 'Volvo ekskavator (katta)', size: '826×548 WebP', tip: 'Shaffof fon. O\'ngga qarab turishi kerak.' },
      { file: 'ex-hyundai.webp', label: 'Hyundai ekskavator (katta)', size: '~800×500 WebP', tip: 'Shaffof fon. Chapga qarab turishi kerak.' },
      { file: 'ex-doosan.webp', label: 'Doosan ekskavator (katta)', size: '~800×500 WebP', tip: 'Shaffof fon. O\'ngga qarab turishi kerak.' },
      { file: 'th-volvo.webp', label: 'Volvo (kichik tugma)', size: '140×93 WebP', tip: 'Model tanlash tugmasi.' },
      { file: 'th-hyundai.webp', label: 'Hyundai (kichik tugma)', size: '140×93 WebP', tip: 'Model tanlash tugmasi.' },
      { file: 'th-doosan.webp', label: 'Doosan (kichik tugma)', size: '140×93 WebP', tip: 'Model tanlash tugmasi.' },
      { file: 'tanker.webp', label: 'Kortex Oil tankeri (2-slayd)', size: '1073×410 WebP', tip: 'Shaffof fon. O\'ngga qarab.' },
      { file: 'ship.webp', label: 'RT Logistics kemasi (3-slayd)', size: '1088×550 WebP', tip: 'Shaffof fon. O\'ngga qarab.' },
      { file: 'truck-hero.webp', label: 'Dream Express yuk mashinasi (4-slayd)', size: '1059×531 WebP', tip: 'Shaffof fon. Chapga qarab.' },
    ],
    texts: [
      { key: 'hLead', label: 'Asosiy izoh matni' },
      { key: 'hBtn', label: 'Tugma: Kompaniyalarimiz' },
      { key: 'hBtn3', label: 'Tugma: Faoliyatimiz' },
      { key: 'hLoc', label: 'Manzil yorlig\'i' },
      { key: 'mdl', label: '"Modellar" sarlavhasi' },
      { key: 'mExc', label: '"Ekskavator" matni' },
      { key: 'r1', label: 'Yo\'nalish 1 nomi' }, { key: 'r1s', label: 'Yo\'nalish 1 izoh' },
      { key: 'r2', label: 'Yo\'nalish 2 nomi' }, { key: 'r2s', label: 'Yo\'nalish 2 izoh' },
      { key: 'r3', label: 'Yo\'nalish 3 nomi' }, { key: 'r3s', label: 'Yo\'nalish 3 izoh' },
      { key: 'r4', label: 'Yo\'nalish 4 nomi' }, { key: 'r4s', label: 'Yo\'nalish 4 izoh' },
    ],
  },
  {
    id: 'brands', num: '03', title: 'Brendlar chizig\'i', color: '#78716C',
    desc: 'Harakatlanuvchi logotiplar chizig\'i (hover = rang, to\'xtash).',
    images: [],
    texts: [
      { key: 'bLbl', label: 'Guruh brendlari yorlig\'i' },
      { key: 'b1', label: '1-matn' }, { key: 'b2', label: '2-matn' }, { key: 'b3', label: '3-matn' },
    ],
  },
  {
    id: 'about', num: '04', title: 'Biz haqimizda', color: '#059669',
    desc: '3 ta animatsiyali ustun: kema, tanker, ekskavator. Kompaniya haqida umumiy matn.',
    images: [
      { file: 'ic-ship.webp', label: 'Kema illustratsiyasi', size: '260×131 WebP', tip: '1-ustun animatsiyasi. Shaffof fon.' },
      { file: 'ic-tanker.webp', label: 'Tanker illustratsiyasi', size: '~250×130 WebP', tip: '2-ustun animatsiyasi. Shaffof fon.' },
      { file: 'ic-excavator.webp', label: 'Ekskavator illustratsiyasi', size: '~250×130 WebP', tip: '3-ustun animatsiyasi. Shaffof fon.' },
      { file: 'container.jpg', label: 'Konteyner foto', size: '900×1200 JPG', tip: 'Vertikal format. Bo\'lim yonidagi katta rasm.' },
    ],
    texts: [
      { key: 'aTag', label: 'Teg' }, { key: 'aTitle', label: 'Sarlavha' },
      { key: 'aBig', label: 'Katta izoh matni' }, { key: 'aBody', label: 'Asosiy matn' },
      { key: 'aBadge', label: 'Konteyner belgi matni' },
      { key: 'p1t', label: '1-ustun sarlavhasi' }, { key: 'p1', label: '1-ustun matni' },
      { key: 'p3t', label: '2-ustun sarlavhasi' }, { key: 'p3', label: '2-ustun matni' },
      { key: 'p4t', label: '3-ustun sarlavhasi' }, { key: 'p4', label: '3-ustun matni' },
    ],
  },
  {
    id: 'trade', num: '05', title: 'Savdo (Eksport / Import)', color: '#DC2626',
    desc: 'Ikki katta karta: Eksport (Volvo ekskavator) va Import (Kortex Oil, neft zavodi).',
    images: [
      { file: 'ex-volvo.webp', label: 'Eksport karta rasmi (Volvo)', size: '826×548 WebP', tip: 'Hero bilan bir xil rasm.' },
      { file: 'refinery.webp', label: 'Import karta fon rasmi', size: '1376×768 WebP', tip: 'Keng landshaft. Neft sanoati.' },
    ],
    texts: [
      { key: 'trTag', label: 'Teg' }, { key: 'trTitle', label: 'Sarlavha' }, { key: 'trText', label: 'Matn' },
      { key: 'trExH', label: 'Eksport karta nomi' }, { key: 'trExP', label: 'Eksport matn' }, { key: 'trExPh', label: 'Eksport izoh' },
      { key: 'trImH', label: 'Import karta nomi' }, { key: 'trImP', label: 'Import matn' },
    ],
  },
  {
    id: 'fleet', num: '06', title: 'Texnika parki (Ekskavatorlar)', color: '#B45309',
    desc: '3 ta ekskavator kartasi: Volvo, Hyundai, Doosan. Xususiyatlar dialogi.',
    images: [],
    texts: [
      { key: 'flTag', label: 'Teg' }, { key: 'flTitle', label: 'Sarlavha' }, { key: 'flText', label: 'Matn' },
      { key: 'flSpec', label: 'Xususiyatlar tugmasi' }, { key: 'flAsk', label: 'So\'rov tugmasi' },
      { key: 'flType', label: 'Texnika turi' },
      { key: 'flYear', label: 'Yil maydoni' }, { key: 'flHours', label: 'Motor soati' }, { key: 'flPrice', label: 'Narx maydoni' },
      { key: 'spY', label: 'Spec: Yil' }, { key: 'spH', label: 'Spec: Motor soati' }, { key: 'spP', label: 'Spec: Dvigatel quvvati' },
      { key: 'spW', label: 'Spec: Ish og\'irligi' }, { key: 'spB', label: 'Spec: Cho\'mich hajmi' },
      { key: 'spD', label: 'Spec: Qazish chuqurligi' }, { key: 'spPr', label: 'Spec: Narx' },
      { key: 'spNote', label: 'Spec: Eslatma' },
    ],
  },
  {
    id: 'process', num: '07', title: 'Jarayon bosqichlari', color: '#7C3AED',
    desc: '6 ta qadam. Oltin chiziq scroll bilan to\'ladi.',
    images: [],
    texts: [
      { key: 'pTag', label: 'Teg' }, { key: 'pTitle', label: 'Sarlavha' }, { key: 'pText', label: 'Matn' },
      { key: 'ps1t', label: '1-qadam nomi' }, { key: 'ps1', label: '1-qadam matni' },
      { key: 'ps2t', label: '2-qadam nomi' }, { key: 'ps2', label: '2-qadam matni' },
      { key: 'ps3t', label: '3-qadam nomi' }, { key: 'ps3', label: '3-qadam matni' },
      { key: 'ps4t', label: '4-qadam nomi' }, { key: 'ps4', label: '4-qadam matni' },
      { key: 'ps5t', label: '5-qadam nomi' }, { key: 'ps5', label: '5-qadam matni' },
      { key: 'ps6t', label: '6-qadam nomi' }, { key: 'ps6', label: '6-qadam matni' },
    ],
  },
  {
    id: 'companies', num: '08', title: 'Kompaniyalar', color: '#0891B2',
    desc: '6 ta kompaniya kartasi: Kortex Oil, Dream Express, RT Motors, RT Medline, aka taxi, RT Logistics.',
    images: [
      { file: 'dream.jpg', label: 'Dream Express foto', size: '480×207 JPG', tip: 'Gorizontal format.' },
      { file: 'rtmotors.jpg', label: 'RT Motors foto', size: '480×289 JPG', tip: 'Gorizontal format.' },
      { file: 'medline.jpg', label: 'RT Medline foto', size: '420×454 JPG', tip: 'Kvadratga yaqin format.' },
      { file: 'akataxi.jpg', label: 'aka taxi foto', size: '480×246 JPG', tip: 'Gorizontal format.' },
      { file: 'ic-ship.webp', label: 'RT Logistics kema ikonkasi', size: '260×131 WebP', tip: 'Logotip yonida.' },
    ],
    texts: [
      { key: 'cTag', label: 'Teg' }, { key: 'cTitle', label: 'Sarlavha' }, { key: 'cText', label: 'Matn' },
      { key: 'catOil', label: 'Kategoriya: Motor moylari' }, { key: 'catLog', label: 'Kategoriya: Logistika' },
      { key: 'catAuto', label: 'Kategoriya: Avto' }, { key: 'catMed', label: 'Kategoriya: Tibbiyot' }, { key: 'catMob', label: 'Kategoriya: Mobillik' },
      { key: 'coKo', label: 'Kortex Oil tavsifi' }, { key: 'coDr', label: 'Dream Express tavsifi' }, { key: 'coDrS', label: 'Dream Express shiori' },
      { key: 'coMo', label: 'RT Motors tavsifi' }, { key: 'coMoS', label: 'RT Motors shiori' },
      { key: 'coMe', label: 'RT Medline tavsifi' }, { key: 'coTaxi', label: 'aka taxi tavsifi' }, { key: 'coRl', label: 'RT Logistics tavsifi' },
    ],
    companies: ['kortexoil', 'dreamexpress', 'rtmotors', 'rtmedline', 'akataxi', 'rtlogistics'],
  },
  {
    id: 'cargo', num: '09', title: 'Kargo (Dream Express)', color: '#EA580C',
    desc: 'Dream Express plakati, 2 foto, dunyo xaritasi, 4 qadam, hamkorlar.',
    images: [
      { file: 'cargo.jpg', label: 'Kargo plakati', size: '1000×1000 JPG', tip: 'Kvadrat format. Yaltiroq effekt.' },
      { file: 'container.jpg', label: 'Konteyner foto', size: '900×1200 JPG', tip: 'Vertikal. Scan line effekti.' },
      { file: 'truck.jpg', label: 'Yuk tekshirish foto', size: '900×1200 JPG', tip: 'Vertikal. Konteyner tekshirish.' },
    ],
    texts: [
      { key: 'kTag', label: 'Teg' }, { key: 'kTitle', label: 'Sarlavha' }, { key: 'kText', label: 'Matn' },
      { key: 'kMid', label: 'O\'rta matn (dengiz/avto/avia)' },
      { key: 'k1', label: '1-foto tagmatn' }, { key: 'k2', label: '2-foto tagmatn' },
      { key: 'kRoutes', label: 'Yo\'nalishlar sarlavhasi' }, { key: 'kPart2', label: 'Hamkor matn' },
      { key: 'kr', label: 'Koreya yorlig\'i' },
      { key: 's1t', label: '1-qadam nomi' }, { key: 's1', label: '1-qadam matni' },
      { key: 's2t', label: '2-qadam nomi' }, { key: 's2', label: '2-qadam matni' },
      { key: 's3t', label: '3-qadam nomi' }, { key: 's3', label: '3-qadam matni' },
      { key: 's4t', label: '4-qadam nomi' }, { key: 's4', label: '4-qadam matni' },
      { key: 'w1', label: 'Xarita: Markaziy Osiyo' }, { key: 'w2', label: 'Xarita: MDH' },
      { key: 'w3', label: 'Xarita: Yaqin Sharq' }, { key: 'w4', label: 'Xarita: Turkiya' },
      { key: 'w5', label: 'Xarita: Yevropa' }, { key: 'w6', label: 'Xarita: Amerika' },
      { key: 'w7', label: 'Xarita: Janubi-Sharqiy Osiyo' },
    ],
  },
  {
    id: 'aka', num: '10', title: 'aka taxi', color: '#16A34A',
    desc: 'Ikki karta: Taxi (yo\'lovchilar) va Driver (haydovchilar).',
    images: [],
    texts: [
      { key: 'tTag', label: 'Teg (Mobillik)' }, { key: 'tTitle', label: 'Sarlavha' }, { key: 'tText', label: 'Matn' },
      { key: 'atQ', label: 'Taxi sarlavha' }, { key: 'atP', label: 'Taxi matn' },
      { key: 'at1', label: 'Taxi xususiyat 1' }, { key: 'at2', label: 'Taxi xususiyat 2' }, { key: 'at3', label: 'Taxi xususiyat 3' },
      { key: 'adQ', label: 'Driver sarlavha' }, { key: 'adP', label: 'Driver matn' },
      { key: 'ad1', label: 'Driver xususiyat 1' }, { key: 'ad2', label: 'Driver xususiyat 2' }, { key: 'ad3', label: 'Driver xususiyat 3' },
    ],
  },
  {
    id: 'news', num: '11', title: 'Yangiliklar', color: '#DB2777',
    desc: '2 ta yangilik maqolasi: Kortex Oil va World Oil Korea shartnomasi.',
    images: [
      { file: 'truck.jpg', label: '1-maqola rasmi', size: '900×1200 JPG', tip: 'Vertikal format.' },
      { file: 'signing.jpg', label: '2-maqola rasmi', size: '1000×961 JPG', tip: 'Kvadratga yaqin.' },
    ],
    texts: [
      { key: 'nwTag', label: 'Teg' }, { key: 'nwTitle', label: 'Sarlavha' },
      { key: 'nwH', label: '1-maqola sarlavhasi' }, { key: 'nwP', label: '1-maqola matni' },
      { key: 'nw2H', label: '2-maqola sarlavhasi' }, { key: 'nw2P', label: '2-maqola matni' },
      { key: 'nwPlace2', label: 'Joylashuv matni' },
      { key: 'may', label: '"may" so\'zi' }, { key: 'mar', label: '"mart" so\'zi' },
    ],
  },
  {
    id: 'numbers', num: '12', title: 'Raqamlar', color: '#9333EA',
    desc: '4 ta raqam plitka: 7 brend, 186+ davlat, 2025, 1000+ jo\'natma.',
    images: [],
    texts: [
      { key: 'nTag', label: 'Teg' }, { key: 'nTitle', label: 'Sarlavha' },
      { key: 'n1', label: '1-raqam yorlig\'i (brend)' }, { key: 'n1d', label: '1-raqam izoh' },
      { key: 'n2', label: '2-raqam yorlig\'i (davlat)' }, { key: 'n2d', label: '2-raqam izoh' },
      { key: 'n3', label: '3-raqam yorlig\'i (World Oil Korea)' }, { key: 'n3d', label: '3-raqam izoh' },
      { key: 'n4', label: '4-raqam yorlig\'i (jo\'natmalar)' }, { key: 'n4d', label: '4-raqam izoh' },
    ],
  },
  {
    id: 'contact', num: '13', title: 'Bog\'lanish', color: '#0284C7',
    desc: 'Kontakt paneli (telefon, email, manzil) va so\'rov formasi.',
    images: [],
    texts: [
      { key: 'ctTag', label: 'Teg' }, { key: 'ctTitle', label: 'Sarlavha' },
      { key: 'ciT', label: 'Info sarlavha' }, { key: 'ciP', label: 'Info matn' },
      { key: 'ciPh', label: 'Telefon yorlig\'i' }, { key: 'ciAd', label: 'Manzil yorlig\'i' }, { key: 'ciAdV', label: 'Manzil qiymati' },
      { key: 'cfT', label: 'Forma sarlavhasi' },
      { key: 'fN', label: 'Ism maydoni' }, { key: 'fP', label: 'Telefon maydoni' }, { key: 'fS', label: 'Xizmat maydoni' }, { key: 'fM', label: 'Xabar maydoni' },
      { key: 'fSend', label: 'Yuborish tugmasi' }, { key: 'fFoot', label: 'Forma pastki izoh' },
      { key: 'oImp', label: 'Opsiya: Kortex Oil' }, { key: 'oExp', label: 'Opsiya: Eksport' },
      { key: 'oCargo', label: 'Opsiya: Dream Express' }, { key: 'oOther', label: 'Opsiya: Boshqa' },
      { key: 'okDemo', label: 'Muvaffaqiyat xabari' }, { key: 'errReq', label: 'Xato xabari' },
      { key: 'lWeb', label: 'Yorliq: Veb-sayt' }, { key: 'lTel', label: 'Yorliq: Telefon' },
      { key: 'lCont', label: 'Yorliq: Aloqa' }, { key: 'lForm', label: 'Yorliq: Murojaat' },
    ],
    companies: ['rtholdings'],
  },
  {
    id: 'footer', num: '14', title: 'Pastki qism (Footer)', color: '#475569',
    desc: 'Oq logo, havola ustunlari, Instagram havolalari, katta "RT Holdings" matn.',
    images: [
      { file: 'rt-logo-white.png', label: 'Footer logo (oq)', size: '720×296 PNG', tip: 'Sarlavha logosi bilan bir xil.' },
    ],
    texts: [
      { key: 'ftNav', label: 'Sahifalar ustun sarlavhasi' }, { key: 'ftSoc', label: 'Ijtimoiy tarmoqlar sarlavhasi' },
    ],
  },
];

/* ── Reusable sub-components ─────────────────────────── */

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return <div className={s.toast}>{msg}</div>;
}

function ImageUploadCard({ img, onUpload }: { img: ImageDef; onUpload: (file: string, data: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rt-cms-images') || '{}');
      if (saved[img.file]) setPreview(saved[img.file]);
    } catch {}
  }, [img.file]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) return;
    if (f.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setPreview(data);
      onUpload(img.file, data);
    };
    reader.readAsDataURL(f);
  };

  const reset = () => {
    setPreview(null);
    onUpload(img.file, null);
  };

  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px',
      background: 'var(--ground)', borderRadius: 12,
    }}>
      <div style={{
        width: 72, height: 54, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
        background: '#E5E1DA', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundImage: 'repeating-conic-gradient(#DDD8D0 0% 25%, transparent 0% 50%)', backgroundSize: '10px 10px',
      }}>
        <img src={preview || `/img/${img.file}`} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{img.label}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{img.size} — {img.tip}</div>
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={handle} />
      <button
        onClick={() => ref.current?.click()}
        style={{
          padding: '8px 16px', border: '2px dashed var(--rule)', borderRadius: 10,
          background: 'var(--white)', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: 'var(--orange-ink)', fontFamily: 'var(--f-body)', flexShrink: 0, whiteSpace: 'nowrap',
          transition: 'border-color 0.2s, background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#FFF7ED'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.background = 'var(--white)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: -2, marginRight: 5 }}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Yuklash
      </button>
      {preview && (
        <button onClick={reset} style={{
          padding: '8px 12px', border: '1px solid var(--rule)', borderRadius: 10,
          background: 'var(--white)', cursor: 'pointer', fontSize: 12, color: '#DC2626',
          fontFamily: 'var(--f-body)', flexShrink: 0,
        }}>Qaytarish</button>
      )}
    </div>
  );
}

function TranslationField({ tKey, label, lang, uz, ru, en, onChange }: {
  tKey: string; label: string; lang: 'uz' | 'ru' | 'en';
  uz: Dict; ru: Dict; en: Dict;
  onChange: (key: string, val: string) => void;
}) {
  const dict = lang === 'uz' ? uz : lang === 'ru' ? ru : en;
  const val = dict[tKey] || '';
  const isMissing = !val && lang !== 'uz';
  const uzRef = uz[tKey] || '';

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--ground)' }}>
      <div style={{ width: 170, flexShrink: 0, paddingTop: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
        {lang !== 'uz' && uzRef && (
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>
            UZ: {uzRef.replace(/<[^>]+>/g, '').slice(0, 60)}{uzRef.length > 60 ? '…' : ''}
          </div>
        )}
      </div>
      <textarea
        value={val}
        onChange={e => onChange(tKey, e.target.value)}
        placeholder={isMissing ? (uzRef.replace(/<[^>]+>/g, '').slice(0, 80) || 'Tarjima kiriting…') : ''}
        rows={val.length > 100 ? 3 : val.length > 50 ? 2 : 1}
        style={{
          flex: 1, border: '1px solid var(--rule)', borderRadius: 8,
          padding: '8px 10px', fontSize: 14, fontFamily: 'var(--f-body)',
          background: isMissing ? '#FFF7ED' : 'var(--white)', resize: 'vertical', minHeight: 40,
        }}
      />
    </div>
  );
}

function CompanyMini({ co, onUpdate }: { co: Company; onUpdate: (id: string, field: string, val: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: 'var(--ground)', borderRadius: 12, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', border: 0, background: 'transparent', cursor: 'pointer',
          fontFamily: 'var(--f-body)', fontSize: 14, fontWeight: 600, color: 'var(--ink)', textAlign: 'left',
        }}
      >
        <span>{co.name}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div className={s.field}><label>Website</label><input value={co.website || ''} onChange={e => onUpdate(co.id, 'website', e.target.value)} /></div>
          <div className={s.field}><label>Instagram</label><input value={co.instagram || ''} onChange={e => onUpdate(co.id, 'instagram', e.target.value)} /></div>
          <div className={s.field}><label>Email</label><input value={co.email || ''} onChange={e => onUpdate(co.id, 'email', e.target.value)} /></div>
          <div className={s.field}><label>Telefon</label><input value={co.phones.map(p => `${p.number} (${p.label})`).join(', ')} readOnly style={{ background: '#eee' }} /></div>
          <div className={s.field} style={{ gridColumn: '1/-1' }}><label>Tavsif</label><textarea value={co.description} onChange={e => onUpdate(co.id, 'description', e.target.value)} /></div>
        </div>
      )}
    </div>
  );
}

/* ── Excavator CRUD ───────────────────────────────────── */

function ExcavatorCRUD({ excavators, onChange }: { excavators: Excavator[]; onChange: (list: Excavator[]) => void }) {
  const [editId, setEditId] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const item: Excavator = {
      id: 'exc-' + Date.now(),
      brand: '',
      model: '',
      type: "G'ildirakli ekskavator",
      year: '',
      hours: '',
      price: '',
      weight: '',
      power: '',
      bucket: '',
      depth: '',
      image: '',
      status: 'active',
    };
    onChange([...excavators, item]);
    setEditId(item.id);
  };

  const update = (id: string, field: keyof Excavator, val: string) => {
    onChange(excavators.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const remove = (id: string) => {
    onChange(excavators.filter(e => e.id !== id));
    if (editId === id) setEditId(null);
  };

  const handleImg = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      update(id, 'image', data);
    };
    reader.readAsDataURL(f);
  };

  const statusColors: Record<string, { bg: string; color: string; label: string }> = {
    active: { bg: '#DCFCE7', color: '#166534', label: 'Faol' },
    sold: { bg: '#FEE2E2', color: '#991B1B', label: 'Sotilgan' },
    reserved: { bg: '#FEF3C7', color: '#92400E', label: 'Band' },
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
          Ekskavatorlar ({excavators.length})
        </h4>
        <button onClick={add} style={{
          padding: '6px 14px', border: '1px solid var(--rule)', borderRadius: 8,
          background: 'var(--white)', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: '#B45309', fontFamily: 'var(--f-body)',
        }}>+ Yangi qo&apos;shish</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {excavators.map(exc => {
          const isEditing = editId === exc.id;
          const st = statusColors[exc.status] || statusColors.active;
          return (
            <div key={exc.id} style={{
              background: 'var(--ground)', borderRadius: 14, overflow: 'hidden',
              border: isEditing ? '2px solid #B45309' : '1px solid var(--rule)',
            }}>
              {/* Header row */}
              <div
                onClick={() => setEditId(isEditing ? null : exc.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 56, height: 42, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                  background: '#E5E1DA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {exc.image ? (
                    <img src={exc.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                    {exc.brand ? `${exc.brand} — ${exc.model}` : 'Yangi ekskavator'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {[exc.type, exc.year && `${exc.year} y.`, exc.hours && `${exc.hours} soat`].filter(Boolean).join(' · ') || 'Ma\'lumotlar kiritilmagan'}
                  </div>
                </div>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: st.bg, color: st.color, fontWeight: 700, flexShrink: 0 }}>
                  {st.label}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"
                  style={{ transform: isEditing ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              {/* Edit form */}
              {isEditing && (
                <div style={{ padding: '0 16px 16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div className={s.field}>
                      <label>Brend</label>
                      <select value={exc.brand} onChange={e => update(exc.id, 'brand', e.target.value)}
                        style={{ minHeight: 44, border: '1px solid var(--rule)', borderRadius: 10, background: 'var(--white)', padding: '0 12px', fontSize: 14, fontFamily: 'var(--f-body)' }}>
                        <option value="">Tanlang...</option>
                        <option>VOLVO</option>
                        <option>HYUNDAI</option>
                        <option>DOOSAN</option>
                        <option>CATERPILLAR</option>
                        <option>KOMATSU</option>
                        <option>HITACHI</option>
                        <option>JCB</option>
                      </select>
                    </div>
                    <div className={s.field}><label>Model nomi</label><input value={exc.model} onChange={e => update(exc.id, 'model', e.target.value)} placeholder="EW160E" /></div>
                    <div className={s.field}><label>Texnika turi</label><input value={exc.type} onChange={e => update(exc.id, 'type', e.target.value)} placeholder="G'ildirakli ekskavator" /></div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div className={s.field}><label>Yil</label><input value={exc.year} onChange={e => update(exc.id, 'year', e.target.value)} placeholder="2021" /></div>
                    <div className={s.field}><label>Motor soati</label><input value={exc.hours} onChange={e => update(exc.id, 'hours', e.target.value)} placeholder="3 800" /></div>
                    <div className={s.field}><label>Narx ($)</label><input value={exc.price} onChange={e => update(exc.id, 'price', e.target.value)} placeholder="45 000" /></div>
                    <div className={s.field}>
                      <label>Holat</label>
                      <select value={exc.status} onChange={e => update(exc.id, 'status', e.target.value as Excavator['status'])}
                        style={{ minHeight: 44, border: '1px solid var(--rule)', borderRadius: 10, background: 'var(--white)', padding: '0 12px', fontSize: 14, fontFamily: 'var(--f-body)' }}>
                        <option value="active">Faol</option>
                        <option value="reserved">Band (rezerv)</option>
                        <option value="sold">Sotilgan</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div className={s.field}><label>Og&apos;irlik</label><input value={exc.weight} onChange={e => update(exc.id, 'weight', e.target.value)} placeholder="17.5 t" /></div>
                    <div className={s.field}><label>Dvigatel quvvati</label><input value={exc.power} onChange={e => update(exc.id, 'power', e.target.value)} placeholder="122 kVt" /></div>
                    <div className={s.field}><label>Cho&apos;mich hajmi</label><input value={exc.bucket} onChange={e => update(exc.id, 'bucket', e.target.value)} placeholder="0.92 m³" /></div>
                    <div className={s.field}><label>Qazish chuqurligi</label><input value={exc.depth} onChange={e => update(exc.id, 'depth', e.target.value)} placeholder="5.5 m" /></div>
                  </div>

                  {/* Image upload */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                    <div style={{
                      width: 100, height: 70, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                      background: '#E5E1DA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundImage: 'repeating-conic-gradient(#DDD8D0 0% 25%, transparent 0% 50%)', backgroundSize: '10px 10px',
                    }}>
                      {exc.image && <img src={exc.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Ekskavator rasmi</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Shaffof fonli WebP/PNG tavsiya etiladi. ~800×500 px.</div>
                      <input ref={imgRef} type="file" accept="image/*" hidden onChange={e => handleImg(exc.id, e)} />
                      <button onClick={() => imgRef.current?.click()} style={{
                        padding: '6px 14px', border: '2px dashed var(--rule)', borderRadius: 8,
                        background: 'var(--white)', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        color: 'var(--orange-ink)', fontFamily: 'var(--f-body)',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: -1, marginRight: 4 }}>
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Rasm yuklash
                      </button>
                      {exc.image && !exc.image.startsWith('/img/') && (
                        <button onClick={() => update(exc.id, 'image', '')} style={{
                          marginLeft: 8, padding: '6px 10px', border: '1px solid var(--rule)', borderRadius: 8,
                          background: 'var(--white)', cursor: 'pointer', fontSize: 12, color: '#DC2626', fontFamily: 'var(--f-body)',
                        }}>O&apos;chirish</button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid var(--rule)' }}>
                    <button onClick={() => remove(exc.id)} className={s.btnDanger} style={{ minHeight: 36, padding: '0 14px', fontSize: 13 }}>
                      O&apos;chirish
                    </button>
                    <button onClick={() => setEditId(null)} className={s.btnPrimary} style={{ minHeight: 36, padding: '0 18px', fontSize: 13 }}>
                      Tayyor
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {excavators.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--muted)', fontSize: 14 }}>
            Hali ekskavator qo&apos;shilmagan. Yuqoridagi &quot;+ Yangi qo&apos;shish&quot; tugmasini bosing.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────── */

export default function SectionsPage() {
  const [uz, setUz] = useState<Dict>({});
  const [ru, setRu] = useState<Dict>({});
  const [en, setEn] = useState<Dict>({});
  const [companies, setCompanies] = useState<Company[]>([]);
  const [excavators, setExcavators] = useState<Excavator[]>([]);
  const [lang, setLang] = useState<'uz' | 'ru' | 'en'>('uz');
  const [openSec, setOpenSec] = useState<string | null>('header');
  const [toast, setToast] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedT = loadFromStorage<{ uz: Dict; ru: Dict; en: Dict } | null>('rt-cms-translations', null);
    setUz(savedT?.uz ?? (uzJson as Dict));
    setRu(savedT?.ru ?? (ruJson as Dict));
    setEn(savedT?.en ?? (enJson as Dict));
    setCompanies(loadFromStorage('rt-cms-companies', DEFAULT_COMPANIES));
    setExcavators(loadFromStorage('rt-cms-excavators', DEFAULT_EXCAVATORS));
    setMounted(true);
  }, []);

  const setDict = lang === 'uz' ? setUz : lang === 'ru' ? setRu : setEn;

  const onTextChange = useCallback((key: string, val: string) => {
    setDict(prev => ({ ...prev, [key]: val }));
  }, [setDict]);

  const onCompanyUpdate = useCallback((id: string, field: string, val: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  }, []);

  const onImageUpload = useCallback((file: string, data: string | null) => {
    try {
      const saved = JSON.parse(localStorage.getItem('rt-cms-images') || '{}');
      if (data) { saved[file] = data; } else { delete saved[file]; }
      localStorage.setItem('rt-cms-images', JSON.stringify(saved));
    } catch {}
  }, []);

  const saveAll = useCallback(() => {
    saveToStorage('rt-cms-translations', { uz, ru, en });
    saveToStorage('rt-cms-companies', companies);
    saveToStorage('rt-cms-excavators', excavators);
    setToast('Barcha o\'zgarishlar saqlandi!');
  }, [uz, ru, en, companies, excavators]);

  const currentDict = lang === 'uz' ? uz : lang === 'ru' ? ru : en;
  const missingCount = useMemo(() => {
    if (lang === 'uz') return 0;
    const dict = lang === 'ru' ? ru : en;
    return SECTIONS.reduce((sum, sec) => sum + sec.texts.filter(t => !dict[t.key]).length, 0);
  }, [lang, ru, en]);

  if (!mounted) return null;

  return (
    <AdminShell title="Sayt bo'limlari">
      {/* Sticky top bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, position: 'sticky', top: 56, zIndex: 30,
        background: 'rgba(246,241,232,0.95)', backdropFilter: 'blur(8px)',
        padding: '12px 0', borderBottom: '1px solid var(--rule)',
      }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--navy-3)', borderRadius: 999, padding: 3 }}>
          {(['uz', 'ru', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                minWidth: 72, minHeight: 38, border: 0, borderRadius: 999, cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'var(--f-body)',
                background: lang === l ? 'var(--orange)' : 'transparent',
                color: lang === l ? 'var(--navy-3)' : 'var(--on-navy-muted)',
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {missingCount > 0 && (
            <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 999, background: '#FEF3C7', color: '#92400E', fontWeight: 600 }}>
              {missingCount} ta tarjima yetmaydi
            </span>
          )}
          <button className={s.btnPrimary} onClick={saveAll} style={{ minHeight: 44 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
            Barchasini saqlash
          </button>
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SECTIONS.map(sec => {
          const isOpen = openSec === sec.id;
          const secMissing = lang !== 'uz' ? sec.texts.filter(t => !currentDict[t.key]).length : 0;
          const sectionCompanies = sec.companies ? companies.filter(c => sec.companies!.includes(c.id)) : [];

          return (
            <div key={sec.id} style={{
              background: 'var(--white)', borderRadius: 16, border: `2px solid ${isOpen ? sec.color : 'var(--rule)'}`,
              overflow: 'hidden', transition: 'border-color 0.2s',
            }}>
              {/* Section header */}
              <button
                onClick={() => setOpenSec(isOpen ? null : sec.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '16px 20px', border: 0, background: isOpen ? sec.color + '08' : 'transparent',
                  cursor: 'pointer', fontFamily: 'var(--f-body)', textAlign: 'left',
                }}
              >
                <span style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, fontFamily: 'var(--f-display)',
                  background: sec.color + '18', color: sec.color,
                }}>{sec.num}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{sec.title}</div>
                  {!isOpen && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sec.desc}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {sec.images.length > 0 && (
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: 'var(--ground)', color: 'var(--muted)' }}>
                      {sec.images.length} rasm
                    </span>
                  )}
                  {sec.texts.length > 0 && (
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: 'var(--ground)', color: 'var(--muted)' }}>
                      {sec.texts.length} matn
                    </span>
                  )}
                  {secMissing > 0 && (
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: '#FEF3C7', color: '#92400E', fontWeight: 700 }}>
                      {secMissing}
                    </span>
                  )}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ padding: '0 20px 24px' }}>
                  <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.5 }}>{sec.desc}</p>

                  {/* Images */}
                  {sec.images.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <h4 style={{
                        fontSize: 13, fontWeight: 700, color: sec.color, textTransform: 'uppercase',
                        letterSpacing: '0.06em', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sec.color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                        Rasmlar ({sec.images.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {sec.images.map(img => (
                          <ImageUploadCard key={img.file} img={img} onUpload={onImageUpload} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Texts */}
                  {sec.texts.length > 0 && (
                    <div style={{ marginBottom: sectionCompanies.length > 0 ? 24 : 0 }}>
                      <h4 style={{
                        fontSize: 13, fontWeight: 700, color: sec.color, textTransform: 'uppercase',
                        letterSpacing: '0.06em', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sec.color} strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16" /></svg>
                        Matnlar — {lang.toUpperCase()} ({sec.texts.length})
                      </h4>
                      <div style={{ background: 'var(--ground)', borderRadius: 12, padding: '4px 14px' }}>
                        {sec.texts.map(t => (
                          <TranslationField
                            key={t.key}
                            tKey={t.key}
                            label={t.label}
                            lang={lang}
                            uz={uz} ru={ru} en={en}
                            onChange={onTextChange}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Excavator CRUD (fleet section only) */}
                  {sec.id === 'fleet' && (
                    <div style={{ marginBottom: sectionCompanies.length > 0 ? 24 : 0 }}>
                      <ExcavatorCRUD excavators={excavators} onChange={setExcavators} />
                    </div>
                  )}

                  {/* Companies */}
                  {sectionCompanies.length > 0 && (
                    <div>
                      <h4 style={{
                        fontSize: 13, fontWeight: 700, color: sec.color, textTransform: 'uppercase',
                        letterSpacing: '0.06em', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sec.color} strokeWidth="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>
                        Kompaniya ma'lumotlari ({sectionCompanies.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {sectionCompanies.map(co => (
                          <CompanyMini key={co.id} co={co} onUpdate={onCompanyUpdate} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </AdminShell>
  );
}
