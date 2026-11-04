'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import AdminShell from '../AdminShell';
import { loadFromStorage, saveToStorage } from '../adminData';
import s from '../admin.module.css';

import uzJson from '../../../../../messages/uz.json';
import ruJson from '../../../../../messages/ru.json';
import enJson from '../../../../../messages/en.json';

type Dict = Record<string, string>;

const sections: { title: string; keys: string[] }[] = [
  {
    title: 'Sarlavha va menyu',
    keys: ['mAbout', 'mTrade', 'mFleet', 'mProcess', 'mCompanies', 'mCargo', 'mAka', 'mNews'],
  },
  {
    title: 'Bosh sahifa (Hero)',
    keys: ['hTag', 'hLead', 'hBtn', 'hLink', 'modellar', 'rTitle'],
  },
  {
    title: 'Kompaniyalar haqida',
    keys: ['aTag', 'aTitle', 'aText', 'aBig', 'aBody', 'aBtn', 'p1', 'p1t', 'p2', 'p2t', 'p3', 'p3t', 'aBadge'],
  },
  {
    title: 'Savdo (Eksport / Import)',
    keys: ['tTag', 'tTitle', 'tText', 'tcE', 'tcET', 'tcEP', 'tcI', 'tcIT', 'tcIP'],
  },
  {
    title: 'Texnika parki',
    keys: ['fTag', 'fTitle', 'fText', 'fBtn', 'fSpec', 'fAsk'],
  },
  {
    title: 'Jarayon bosqichlari',
    keys: ['prTag', 'prTitle', 'prText', 'prBtn', 'pr1', 'pr1t', 'pr2', 'pr2t', 'pr3', 'pr3t', 'pr4', 'pr4t', 'pr5', 'pr5t', 'pr6', 'pr6t'],
  },
  {
    title: 'Kompaniyalar',
    keys: ['cTag', 'cTitle', 'cText', 'catOil', 'catLog', 'catAuto', 'catMed', 'catMob', 'coKo', 'coDr', 'coDrS', 'coMo', 'coMoS', 'coMe', 'coTaxi', 'coRl'],
  },
  {
    title: 'Kargo (Dream Express)',
    keys: ['cgTag', 'cgTitle', 'cgText', 'cgS1', 'cgS1t', 'cgS2', 'cgS2t', 'cgS3', 'cgS3t', 'cgS4', 'cgS4t'],
  },
  {
    title: 'aka taxi',
    keys: ['akTag', 'akTitle', 'akText', 'akT', 'akTt', 'akD', 'akDt'],
  },
  {
    title: 'Yangiliklar',
    keys: ['nTag', 'nTitle', 'nText'],
  },
  {
    title: 'Raqamlar',
    keys: ['nuTag', 'nuTitle', 'nuText', 'nu1', 'nu1t', 'nu2', 'nu2t', 'nu3', 'nu3t', 'nu4', 'nu4t'],
  },
  {
    title: "Bog'lanish",
    keys: ['ctTag', 'ctTitle', 'ciT', 'ciP', 'ciPh', 'ciAd', 'ciAdV', 'cfT', 'fN', 'fP', 'fS', 'fM', 'fSend', 'fFoot', 'oImp', 'oExp', 'oCargo', 'oOther', 'okDemo', 'errReq'],
  },
  {
    title: 'Pastki qism (Footer)',
    keys: ['nCos', 'nAbout', 'nNews', 'nContact', 'ftNav', 'ftSoc'],
  },
  {
    title: 'Motion band',
    keys: ['bImport', 'bExport', 'bLogistics', 'bMobility'],
  },
  {
    title: 'Boshqa',
    keys: ['lWeb', 'lTel', 'lCont', 'lForm', 'rTitle'],
  },
];

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return <div className={s.toast}>{msg}</div>;
}

function friendlyLabel(key: string): string {
  const labels: Record<string, string> = {
    mAbout: 'Biz haqimizda', mTrade: 'Savdo', mFleet: 'Texnika parki', mProcess: 'Jarayon',
    mCompanies: 'Kompaniyalar', mCargo: 'Kargo', mAka: 'aka taxi', mNews: 'Yangiliklar',
    hTag: 'Hero teg', hLead: 'Hero matn', hBtn: 'Hero tugma', hLink: 'Hero havola',
    modellar: 'Modellar sarlavha', rTitle: "Yo'nalishlar",
    aTag: 'Teg', aTitle: 'Sarlavha', aText: 'Matn', aBig: 'Katta matn', aBody: 'Asosiy matn',
    aBtn: 'Tugma', aBadge: 'Belgi', p1: '1-ustun', p1t: '1-ustun matn', p2: '2-ustun', p2t: '2-ustun matn', p3: '3-ustun', p3t: '3-ustun matn',
    tTag: 'Teg', tTitle: 'Sarlavha', tText: 'Matn',
    tcE: 'Eksport karta nomi', tcET: 'Eksport matn', tcEP: 'Eksport izoh',
    tcI: 'Import karta nomi', tcIT: 'Import matn', tcIP: 'Import izoh',
    fTag: 'Teg', fTitle: 'Sarlavha', fText: 'Matn', fBtn: 'Tugma', fSpec: 'Xususiyatlar', fAsk: "So'rov",
    prTag: 'Teg', prTitle: 'Sarlavha', prText: 'Matn', prBtn: 'Tugma',
    cTag: 'Teg', cTitle: 'Sarlavha', cText: 'Matn',
    catOil: 'Kategoriya: Moy', catLog: 'Kategoriya: Logistika', catAuto: 'Kategoriya: Avtomobil',
    catMed: 'Kategoriya: Tibbiyot', catMob: 'Kategoriya: Mobil',
    coKo: 'Kortex Oil tavsif', coDr: 'Dream Express tavsif', coDrS: 'Dream Express shior',
    coMo: 'RT Motors tavsif', coMoS: 'RT Motors shior', coMe: 'RT Medline tavsif',
    coTaxi: 'aka taxi tavsif', coRl: 'RT Logistics tavsif',
    cgTag: 'Teg', cgTitle: 'Sarlavha', cgText: 'Matn',
    akTag: 'Teg', akTitle: 'Sarlavha', akText: 'Matn',
    akT: 'Taxi nomi', akTt: 'Taxi matn', akD: 'Driver nomi', akDt: 'Driver matn',
    nTag: 'Teg', nTitle: 'Sarlavha', nText: 'Matn',
    nuTag: 'Teg', nuTitle: 'Sarlavha', nuText: 'Matn',
    ctTag: 'Teg', ctTitle: 'Sarlavha',
    ciT: 'Info sarlavha', ciP: 'Info matn', ciPh: 'Telefon', ciAd: 'Manzil', ciAdV: 'Manzil qiymati',
    cfT: 'Forma sarlavha', fN: 'Ism', fP: 'Telefon', fS: 'Xizmat', fM: 'Xabar',
    fSend: 'Yuborish', fFoot: 'Pastki izoh',
    oImp: 'Import opsiyasi', oExp: 'Eksport opsiyasi', oCargo: 'Kargo opsiyasi', oOther: 'Boshqa opsiyasi',
    okDemo: 'Muvaffaqiyat xabar', errReq: 'Xato xabar',
    nCos: 'Kompaniyalar', nAbout: 'Biz haqimizda', nNews: 'Yangiliklar', nContact: "Bog'lanish",
    ftNav: 'Navigatsiya', ftSoc: 'Ijtimoiy tarmoqlar',
    bImport: 'Import', bExport: 'Eksport', bLogistics: 'Logistika', bMobility: 'Mobillik',
    lWeb: 'Veb-sayt', lTel: 'Telefon', lCont: "Bog'lanish", lForm: 'Forma',
  };
  return labels[key] || key;
}

export default function TranslationsPage() {
  const [uz, setUz] = useState<Dict>({});
  const [ru, setRu] = useState<Dict>({});
  const [en, setEn] = useState<Dict>({});
  const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz');
  const [openSection, setOpenSection] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage<{ uz: Dict; ru: Dict; en: Dict } | null>('rt-cms-translations', null);
    setUz(saved?.uz ?? uzJson);
    setRu(saved?.ru ?? ruJson);
    setEn(saved?.en ?? enJson);
    setMounted(true);
  }, []);

  const currentDict = activeLang === 'uz' ? uz : activeLang === 'ru' ? ru : en;
  const setCurrentDict = activeLang === 'uz' ? setUz : activeLang === 'ru' ? setRu : setEn;

  const updateVal = useCallback((key: string, val: string) => {
    setCurrentDict(prev => ({ ...prev, [key]: val }));
  }, [setCurrentDict]);

  const save = useCallback(() => {
    saveToStorage('rt-cms-translations', { uz, ru, en });
    setToast('Saqlandi ✓');
  }, [uz, ru, en]);

  const allKeys = useMemo(() => {
    const keys = new Set([...Object.keys(uz), ...Object.keys(ru), ...Object.keys(en)]);
    return Array.from(keys);
  }, [uz, ru, en]);

  const missingRu = useMemo(() => allKeys.filter(k => !ru[k]).length, [allKeys, ru]);
  const missingEn = useMemo(() => allKeys.filter(k => !en[k]).length, [allKeys, en]);

  const categorizedKeys = useMemo(() => {
    const used = new Set<string>();
    sections.forEach(sec => sec.keys.forEach(k => used.add(k)));
    const uncategorized = allKeys.filter(k => !used.has(k));
    return uncategorized;
  }, [allKeys]);

  const filteredSections = useMemo(() => {
    if (!search) return null;
    const q = search.toLowerCase();
    const matches: string[] = [];
    allKeys.forEach(k => {
      if (
        k.toLowerCase().includes(q) ||
        friendlyLabel(k).toLowerCase().includes(q) ||
        (uz[k] || '').toLowerCase().includes(q) ||
        (ru[k] || '').toLowerCase().includes(q) ||
        (en[k] || '').toLowerCase().includes(q)
      ) {
        matches.push(k);
      }
    });
    return matches;
  }, [search, allKeys, uz, ru, en]);

  if (!mounted) return null;

  return (
    <AdminShell title="Tarjimalar">
      {/* Top bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--navy-3)', borderRadius: 999, padding: 3 }}>
          {(['uz', 'ru', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => setActiveLang(l)}
              style={{
                minWidth: 64, minHeight: 40, border: 0, borderRadius: 999, cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'var(--f-body)',
                background: activeLang === l ? 'var(--orange)' : 'transparent',
                color: activeLang === l ? 'var(--navy-3)' : 'var(--on-navy-muted)',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {l === 'uz' ? "O'zbekcha" : l === 'ru' ? 'Русский' : 'English'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {missingRu > 0 && activeLang === 'ru' && (
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: '#FEF3C7', color: '#92400E' }}>
              {missingRu} ta tarjima yetmaydi
            </span>
          )}
          {missingEn > 0 && activeLang === 'en' && (
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: '#FEF3C7', color: '#92400E' }}>
              {missingEn} translations missing
            </span>
          )}
          <button className={s.btnPrimary} onClick={save}>Saqlash</button>
        </div>
      </div>

      {/* Search */}
      <input
        className={s.searchInput}
        placeholder="Qidirish..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />

      {/* Search results */}
      {filteredSections ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
            {filteredSections.length} ta natija topildi
          </p>
          {filteredSections.map(key => (
            <div key={key} style={{
              background: 'var(--white)', borderRadius: 12, padding: '14px 18px',
              border: '1px solid var(--rule)',
            }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
                {friendlyLabel(key)}
              </div>
              <textarea
                value={currentDict[key] || ''}
                onChange={e => updateVal(key, e.target.value)}
                placeholder={activeLang !== 'uz' && !currentDict[key] ? (uz[key] || 'Tarjima kiriting...') : 'Matn kiriting...'}
                rows={2}
                style={{
                  width: '100%', border: '1px solid var(--rule)', borderRadius: 8,
                  padding: '10px 12px', fontSize: 15, fontFamily: 'var(--f-body)',
                  background: !currentDict[key] && activeLang !== 'uz' ? '#FFF7ED' : 'var(--ground)',
                  resize: 'vertical', minHeight: 44,
                }}
              />
              {activeLang !== 'uz' && uz[key] && (
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                  UZ: {uz[key].length > 80 ? uz[key].slice(0, 80) + '...' : uz[key]}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Sections accordion */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sections.map((sec, i) => {
            const isOpen = openSection === i;
            const sectionMissing = sec.keys.filter(k => !currentDict[k] && (activeLang === 'uz' ? uz[k] : uz[k])).length;
            return (
              <div key={i} style={{
                background: 'var(--white)', borderRadius: 14, border: '1px solid var(--rule)',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setOpenSection(isOpen ? -1 : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', border: 0, background: 'transparent', cursor: 'pointer',
                    fontFamily: 'var(--f-body)', fontSize: 16, fontWeight: 600, color: 'var(--ink)',
                    textAlign: 'left',
                  }}
                >
                  <span>{sec.title}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {sectionMissing > 0 && activeLang !== 'uz' && (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#FEF3C7', color: '#92400E' }}>
                        {sectionMissing}
                      </span>
                    )}
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>{sec.keys.length}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {sec.keys.map(key => {
                      const val = currentDict[key] || '';
                      const isMissing = !val && activeLang !== 'uz';
                      return (
                        <div key={key}>
                          <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
                            {friendlyLabel(key)}
                          </label>
                          <textarea
                            value={val}
                            onChange={e => updateVal(key, e.target.value)}
                            placeholder={isMissing ? (uz[key] || 'Tarjima kiriting...') : 'Matn kiriting...'}
                            rows={val.length > 80 ? 3 : 1}
                            style={{
                              width: '100%', border: '1px solid var(--rule)', borderRadius: 8,
                              padding: '10px 12px', fontSize: 15, fontFamily: 'var(--f-body)',
                              background: isMissing ? '#FFF7ED' : 'var(--ground)',
                              resize: 'vertical', minHeight: 44,
                            }}
                          />
                          {activeLang !== 'uz' && uz[key] && (
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                              UZ: {uz[key].length > 100 ? uz[key].slice(0, 100) + '...' : uz[key]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Uncategorized keys */}
          {categorizedKeys.length > 0 && (
            <div style={{
              background: 'var(--white)', borderRadius: 14, border: '1px solid var(--rule)',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setOpenSection(openSection === 99 ? -1 : 99)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', border: 0, background: 'transparent', cursor: 'pointer',
                  fontFamily: 'var(--f-body)', fontSize: 16, fontWeight: 600, color: 'var(--ink)',
                  textAlign: 'left',
                }}
              >
                <span>Boshqa kalitlar</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{categorizedKeys.length}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"
                    style={{ transform: openSection === 99 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              {openSection === 99 && (
                <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {categorizedKeys.map(key => {
                    const val = currentDict[key] || '';
                    const isMissing = !val && activeLang !== 'uz';
                    return (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
                          {friendlyLabel(key)}
                        </label>
                        <textarea
                          value={val}
                          onChange={e => updateVal(key, e.target.value)}
                          placeholder={isMissing ? (uz[key] || '') : ''}
                          rows={1}
                          style={{
                            width: '100%', border: '1px solid var(--rule)', borderRadius: 8,
                            padding: '10px 12px', fontSize: 15, fontFamily: 'var(--f-body)',
                            background: isMissing ? '#FFF7ED' : 'var(--ground)',
                            resize: 'vertical', minHeight: 44,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </AdminShell>
  );
}
