'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import AdminShell from '../AdminShell';
import s from '../admin.module.css';

interface ImageEntry {
  file: string;
  label: string;
  section: string;
  where: string;
  size: string;
  tip: string;
}

const images: ImageEntry[] = [
  // Logos
  { file: 'rt-logo.png', label: 'Logo (qora)', section: 'Sarlavha / Admin', where: 'Sahifa yuqorisidagi sarlavha (oq fon ustida). Admin login sahifasi.', size: '720×296 px, PNG', tip: 'Orqa foni shaffof PNG. Qora/to\'q rang logo — oq fonli sahifa uchun.' },
  { file: 'rt-logo-white.png', label: 'Logo (oq)', section: 'Sarlavha / Pastki qism', where: 'Hero ustida sarlavha (to\'q fon) va pastki qism (footer). Admin panel yonbari.', size: '720×296 px, PNG', tip: 'Orqa foni shaffof PNG. Oq rang logo — qora/to\'q fonlar uchun.' },

  // Hero vehicles
  { file: 'ex-volvo.webp', label: 'Volvo ekskavator (katta)', section: 'Hero slayd / Savdo', where: 'Hero slayderda 1-slayd asosiy transport vositasi. Savdo bo\'limida Eksport kartasi rasmi.', size: '826×548 px, WebP', tip: 'Orqa foni shaffof yoki oq. Mashina to\'liq ko\'rinishi, o\'ngga qarab turishi kerak.' },
  { file: 'ex-hyundai.webp', label: 'Hyundai ekskavator (katta)', section: 'Hero slayd', where: 'Hero slayderda 1-slaydning 2-brendi. Chapdan kirib keladi.', size: '~800×500 px, WebP', tip: 'Orqa foni shaffof. Mashina chapga qarab turishi kerak (chapdan keladi).' },
  { file: 'ex-doosan.webp', label: 'Doosan ekskavator (katta)', section: 'Hero slayd', where: 'Hero slayderda 1-slaydning 3-brendi.', size: '~800×500 px, WebP', tip: 'Orqa foni shaffof. O\'ngga qarab turishi kerak.' },
  { file: 'th-volvo.webp', label: 'Volvo (kichik)', section: 'Hero model tanlash', where: 'Hero pastidagi "Modellar" 3 ta tugma ichida birinchisi.', size: '140×93 px, WebP', tip: 'Kichik oldindan ko\'rish rasmi. Orqa foni shaffof.' },
  { file: 'th-hyundai.webp', label: 'Hyundai (kichik)', section: 'Hero model tanlash', where: '"Modellar" tugmalari ichida ikkinchisi.', size: '140×93 px, WebP', tip: 'Kichik oldindan ko\'rish rasmi. Orqa foni shaffof.' },
  { file: 'th-doosan.webp', label: 'Doosan (kichik)', section: 'Hero model tanlash', where: '"Modellar" tugmalari ichida uchinchisi.', size: '140×93 px, WebP', tip: 'Kichik oldindan ko\'rish rasmi. Orqa foni shaffof.' },
  { file: 'tanker.webp', label: 'Yoqilg\'i tanker', section: 'Hero slayd 2', where: '2-slayd — KORTEX OIL. Katta tanker mashinasi o\'ngdan kirib keladi.', size: '1073×410 px, WebP', tip: 'Orqa foni shaffof. Mashina o\'ngga qarab turishi kerak.' },
  { file: 'ship.webp', label: 'Kargo kemasi', section: 'Hero slayd 3', where: '3-slayd — RT LOGISTICS. Kema o\'ngdan kirib keladi.', size: '1088×550 px, WebP', tip: 'Orqa foni shaffof. Kema o\'ngga qarab turishi kerak.' },
  { file: 'truck-hero.webp', label: 'Koreya bayroqli yuk mashinasi', section: 'Hero slayd 4', where: '4-slayd — DREAM EXPRESS. Yuk mashinasi chapdan kirib keladi.', size: '1059×531 px, WebP', tip: 'Orqa foni shaffof. Mashina chapga qarab turishi kerak (chapdan keladi).' },

  // Pillar icons
  { file: 'ic-ship.webp', label: 'Kema ikonkasi', section: 'Biz haqimizda / Kompaniyalar', where: '"Biz haqimizda" bo\'limida 1-ustun (kema to\'lqinda). RT Logistics kartasida logotip yonida.', size: '260×131 px, WebP', tip: 'Kichik illustratsiya. Orqa foni shaffof.' },
  { file: 'ic-tanker.webp', label: 'Tanker ikonkasi', section: 'Biz haqimizda', where: '"Biz haqimizda" bo\'limida 2-ustun (tanker yo\'lda harakatlanadi).', size: '~250×130 px, WebP', tip: 'Kichik illustratsiya. Orqa foni shaffof.' },
  { file: 'ic-excavator.webp', label: 'Ekskavator ikonkasi', section: 'Biz haqimizda', where: '"Biz haqimizda" bo\'limida 3-ustun (ekskavator tebranadi).', size: '~250×130 px, WebP', tip: 'Kichik illustratsiya. Orqa foni shaffof.' },

  // Section photos
  { file: 'container.jpg', label: 'Konteyner foto', section: 'Biz haqimizda / Kargo', where: '"Biz haqimizda" bo\'limida katta portret rasm. Kargo bo\'limida 1-foto.', size: '900×1200 px, JPG', tip: 'Portret (vertikal) format. Konteynerlarga yuklangan mahsulotlar ko\'rinishi.' },
  { file: 'refinery.webp', label: 'Neftni qayta ishlash zavodi', section: 'Savdo', where: 'Savdo bo\'limida Import kartasi fon rasmi.', size: '1376×768 px, WebP', tip: 'Keng landshaft format. Neft sanoati ko\'rinishi.' },

  // Company photos
  { file: 'dream.jpg', label: 'Dream Express foto', section: 'Kompaniyalar', where: 'Dream Express kompaniya kartasi rasmi.', size: '480×207 px, JPG', tip: 'Keng gorizontal format. Kompaniyaga tegishli rasm.' },
  { file: 'rtmotors.jpg', label: 'RT Motors foto', section: 'Kompaniyalar', where: 'RT Motors kompaniya kartasi rasmi.', size: '480×289 px, JPG', tip: 'Gorizontal format. Avtomobil yoki kompaniya ko\'rinishi.' },
  { file: 'medline.jpg', label: 'RT Medline foto', section: 'Kompaniyalar', where: 'RT Medline kompaniya kartasi rasmi.', size: '420×454 px, JPG', tip: 'Kvadratga yaqin format. Tibbiy mahsulotlar yoki kompaniya ko\'rinishi.' },
  { file: 'akataxi.jpg', label: 'aka taxi foto', section: 'Kompaniyalar', where: 'aka taxi kompaniya kartasi rasmi.', size: '480×246 px, JPG', tip: 'Gorizontal format. Taksi yoki ilova ko\'rinishi.' },

  // Cargo section
  { file: 'cargo.jpg', label: 'Kargo plakati', section: 'Kargo (Dream Express)', where: 'Kargo bo\'limida katta plakat rasm (yaltiroq effekt bilan).', size: '1000×1000 px, JPG', tip: 'Kvadrat format. Dream Express reklama plakati.' },
  { file: 'truck.jpg', label: 'Yuk tekshirish foto', section: 'Kargo / Yangiliklar', where: 'Kargo bo\'limida 2-foto. Yangiliklar 1-maqola rasmi.', size: '900×1200 px, JPG', tip: 'Portret (vertikal) format. Konteyner yoki yuk tekshirish jarayoni.' },

  // News
  { file: 'signing.jpg', label: 'Shartnoma imzolash', section: 'Yangiliklar', where: 'Yangiliklar 2-maqola rasmi (World Oil Korea shartnomasi).', size: '1000×961 px, JPG', tip: 'Kvadratga yaqin format. Shartnoma imzolash marosimi.' },
];

const sectionColors: Record<string, string> = {
  'Sarlavha / Admin': '#6366F1',
  'Sarlavha / Pastki qism': '#6366F1',
  'Hero slayd': '#C9A26B',
  'Hero slayd / Savdo': '#C9A26B',
  'Hero slayd 2': '#C9A26B',
  'Hero slayd 3': '#C9A26B',
  'Hero slayd 4': '#C9A26B',
  'Hero model tanlash': '#C9A26B',
  'Biz haqimizda': '#059669',
  'Biz haqimizda / Kompaniyalar': '#059669',
  'Biz haqimizda / Kargo': '#059669',
  'Savdo': '#DC2626',
  'Kompaniyalar': '#7C3AED',
  'Kargo (Dream Express)': '#0891B2',
  'Kargo / Yangiliklar': '#0891B2',
  'Yangiliklar': '#EA580C',
};

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div className={s.toast}>{msg}</div>;
}

function ImageCard({ img }: { img: ImageEntry }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const color = sectionColors[img.section] || 'var(--muted)';

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast('Faqat rasm fayllari qabul qilinadi');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setToast('Rasm hajmi 5MB dan oshmasin');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setPreview(data);
      try {
        const saved = JSON.parse(localStorage.getItem('rt-cms-images') || '{}');
        saved[img.file] = data;
        localStorage.setItem('rt-cms-images', JSON.stringify(saved));
        setToast('Rasm saqlandi! (demo rejim)');
      } catch {
        setToast('Saqlashda xatolik');
      }
    };
    reader.readAsDataURL(file);
  }, [img.file]);

  const removeCustom = useCallback(() => {
    setPreview(null);
    try {
      const saved = JSON.parse(localStorage.getItem('rt-cms-images') || '{}');
      delete saved[img.file];
      localStorage.setItem('rt-cms-images', JSON.stringify(saved));
      setToast('Asl rasm qayta tiklandi');
    } catch {}
  }, [img.file]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rt-cms-images') || '{}');
      if (saved[img.file]) setPreview(saved[img.file]);
    } catch {}
  }, [img.file]);

  return (
    <div style={{
      background: 'var(--white)', borderRadius: 16, border: '1px solid var(--rule)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Image preview */}
      <div style={{
        position: 'relative', background: '#F0EDE8', minHeight: 160,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundImage: 'repeating-conic-gradient(#E5E1DA 0% 25%, transparent 0% 50%)',
        backgroundSize: '16px 16px',
      }}>
        <img
          src={preview || `/img/${img.file}`}
          alt={img.label}
          style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', display: 'block' }}
        />
        {preview && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: '#059669', color: '#fff', fontSize: 11, fontWeight: 600,
            padding: '2px 8px', borderRadius: 999,
          }}>Yangilangan</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', fontFamily: 'var(--f-body)' }}>
            {img.label}
          </span>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600,
            background: color + '18', color: color,
          }}>{img.section}</span>
        </div>

        <code style={{
          fontSize: 12, color: 'var(--muted)', background: 'var(--ground)',
          padding: '2px 6px', borderRadius: 4, alignSelf: 'flex-start',
        }}>/img/{img.file}</code>

        {/* Where it appears */}
        <div style={{
          background: '#F0F7FF', borderRadius: 10, padding: '10px 12px',
          borderLeft: `3px solid ${color}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: color, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Saytda qayerda ko'rinadi
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>
            {img.where}
          </div>
        </div>

        {/* Recommendation */}
        <div style={{
          background: 'var(--ground)', borderRadius: 10, padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tavsiyalar
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>
            <b>O'lcham:</b> {img.size}<br />
            {img.tip}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              flex: 1, padding: '10px 0', border: '2px dashed var(--rule)', borderRadius: 10,
              background: 'transparent', cursor: 'pointer', fontFamily: 'var(--f-body)',
              fontSize: 13, fontWeight: 600, color: 'var(--orange-ink)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#FFF7ED'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: -3, marginRight: 6 }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Rasm yuklash
          </button>
          {preview && (
            <button
              onClick={removeCustom}
              style={{
                padding: '10px 14px', border: '1px solid var(--rule)', borderRadius: 10,
                background: 'transparent', cursor: 'pointer', fontFamily: 'var(--f-body)',
                fontSize: 13, color: '#DC2626',
              }}
            >
              Qaytarish
            </button>
          )}
        </div>
      </div>
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </div>
  );
}

const sectionOrder = [
  'Logotiplar',
  'Hero slaydlar (asosiy transportlar)',
  'Hero model tanlash (kichik rasmlar)',
  'Biz haqimizda (ustun ikonkalari)',
  'Bo\'lim fotosuratlari',
  'Kompaniya kartalari',
  'Kargo bo\'limi',
  'Yangiliklar',
];

function groupImages() {
  const groups: { title: string; items: ImageEntry[] }[] = [
    { title: 'Logotiplar', items: images.filter(i => i.file.includes('rt-logo')) },
    { title: 'Hero slaydlar (asosiy transportlar)', items: images.filter(i => ['ex-volvo.webp', 'ex-hyundai.webp', 'ex-doosan.webp', 'tanker.webp', 'ship.webp', 'truck-hero.webp'].includes(i.file)) },
    { title: 'Hero model tanlash (kichik rasmlar)', items: images.filter(i => i.file.startsWith('th-')) },
    { title: 'Biz haqimizda (ustun ikonkalari)', items: images.filter(i => i.file.startsWith('ic-')) },
    { title: 'Bo\'lim fotosuratlari', items: images.filter(i => ['container.jpg', 'refinery.webp'].includes(i.file)) },
    { title: 'Kompaniya kartalari', items: images.filter(i => ['dream.jpg', 'rtmotors.jpg', 'medline.jpg', 'akataxi.jpg'].includes(i.file)) },
    { title: 'Kargo bo\'limi', items: images.filter(i => ['cargo.jpg', 'truck.jpg'].includes(i.file)) },
    { title: 'Yangiliklar', items: images.filter(i => i.file === 'signing.jpg') },
  ];
  return groups;
}

export default function ImagesPage() {
  const groups = groupImages();

  return (
    <AdminShell title="Rasmlar boshqaruvi">
      <div style={{
        background: '#FEF3C7', borderRadius: 12, padding: '12px 16px', marginBottom: 24,
        display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#92400E',
        lineHeight: 1.5,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <b>Demo rejim:</b> Yuklangan rasmlar brauzer xotirasida saqlanadi (localStorage).
          Haqiqiy serverga ulangandan keyin rasmlar <code>/public/img/</code> papkasiga saqlanadi.
          Har bir rasmning o'lchami va formati tavsiyasiga amal qiling.
        </div>
      </div>

      {/* Site map legend */}
      <div style={{
        background: 'var(--white)', borderRadius: 14, border: '1px solid var(--rule)',
        padding: '16px 18px', marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px', color: 'var(--ink)', fontFamily: 'var(--f-body)' }}>
          Sayt tuzilishi — rasmlar xaritasi
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { num: '01', name: 'Sarlavha', color: '#6366F1', imgs: 'rt-logo.png, rt-logo-white.png' },
            { num: '02', name: 'Hero slayder', color: '#C9A26B', imgs: 'ex-volvo, ex-hyundai, ex-doosan, tanker, ship, truck-hero + th-* kichik' },
            { num: '03', name: 'Biz haqimizda', color: '#059669', imgs: 'ic-ship, ic-tanker, ic-excavator, container.jpg' },
            { num: '04', name: 'Savdo', color: '#DC2626', imgs: 'ex-volvo.webp, refinery.webp' },
            { num: '05', name: 'Kompaniyalar', color: '#7C3AED', imgs: 'dream, rtmotors, medline, akataxi, ic-ship' },
            { num: '06', name: 'Kargo', color: '#0891B2', imgs: 'cargo.jpg, container.jpg, truck.jpg' },
            { num: '07', name: 'Yangiliklar', color: '#EA580C', imgs: 'truck.jpg, signing.jpg' },
            { num: '08', name: 'Pastki qism', color: '#6366F1', imgs: 'rt-logo-white.png' },
          ].map(sec => (
            <div key={sec.num} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0',
              borderBottom: '1px solid var(--ground)',
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8, background: sec.color + '18', color: sec.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                flexShrink: 0,
              }}>{sec.num}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', minWidth: 120 }}>{sec.name}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>{sec.imgs}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Image groups */}
      {groups.map((group, gi) => (
        <div key={gi} style={{ marginBottom: 32 }}>
          <h3 style={{
            fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--f-body)',
            margin: '0 0 14px', paddingBottom: 8, borderBottom: '2px solid var(--rule)',
          }}>
            {group.title}
            <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)', marginLeft: 8 }}>
              ({group.items.length} ta rasm)
            </span>
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}>
            {group.items.map(img => (
              <ImageCard key={img.file} img={img} />
            ))}
          </div>
        </div>
      ))}
    </AdminShell>
  );
}
