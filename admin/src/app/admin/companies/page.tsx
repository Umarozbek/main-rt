'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { DEFAULT_COMPANIES, loadFromStorage, saveToStorage, type Company } from '../adminData';
import s from '../admin.module.css';

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return <div className={s.toast}>{msg}</div>;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCompanies(loadFromStorage('rt-cms-companies', DEFAULT_COMPANIES));
    setMounted(true);
  }, []);

  const update = useCallback((id: string, field: string, value: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const updatePhone = useCallback((id: string, idx: number, field: 'number' | 'label', value: string) => {
    setCompanies(prev => prev.map(c => {
      if (c.id !== id) return c;
      const phones = [...c.phones];
      phones[idx] = { ...phones[idx], [field]: value };
      return { ...c, phones };
    }));
  }, []);

  const addPhone = useCallback((id: string) => {
    setCompanies(prev => prev.map(c =>
      c.id === id ? { ...c, phones: [...c.phones, { number: '', label: '' }] } : c
    ));
  }, []);

  const removePhone = useCallback((id: string, idx: number) => {
    setCompanies(prev => prev.map(c =>
      c.id === id ? { ...c, phones: c.phones.filter((_, i) => i !== idx) } : c
    ));
  }, []);

  const save = useCallback(() => {
    saveToStorage('rt-cms-companies', companies);
    setToast('Saqlandi ✓');
  }, [companies]);

  if (!mounted) return null;

  return (
    <AdminShell title="Kompaniyalar">
      <div className={s.sectionHead}>
        <h2 className={s.sectionTitle}>{companies.length} ta kompaniya</h2>
        <button className={s.btnPrimary} onClick={save}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
          Barchasini saqlash
        </button>
      </div>

      <div className={s.companyList}>
        {companies.map(co => (
          <div key={co.id} className={s.companyCard}>
            <div className={s.companyHeader} onClick={() => setOpen(open === co.id ? null : co.id)}>
              <div className={s.companyName}>
                {co.name}
                {co.website && <span className={s.companyBadge}>{co.website}</span>}
              </div>
              <div className={`${s.companyToggle} ${open === co.id ? s.companyToggleOpen : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
            {open === co.id && (
              <div className={s.companyBody}>
                <div className={s.field}>
                  <label>Nomi</label>
                  <input value={co.name} onChange={e => update(co.id, 'name', e.target.value)} />
                </div>
                <div className={s.field}>
                  <label>Website</label>
                  <input value={co.website || ''} onChange={e => update(co.id, 'website', e.target.value)} placeholder="example.com" />
                </div>
                <div className={s.field}>
                  <label>Instagram</label>
                  <input value={co.instagram || ''} onChange={e => update(co.id, 'instagram', e.target.value)} placeholder="username" />
                </div>
                <div className={s.field}>
                  <label>Email</label>
                  <input value={co.email || ''} onChange={e => update(co.id, 'email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div className={s.field} style={{ gridColumn: '1/-1' }}>
                  <label>Tavsif</label>
                  <textarea value={co.description} onChange={e => update(co.id, 'description', e.target.value)} />
                </div>
                <div className={s.field}>
                  <label>Slogan</label>
                  <input value={co.slogan || ''} onChange={e => update(co.id, 'slogan', e.target.value)} />
                </div>
                <div className={s.field} style={{ gridColumn: '1/-1' }}>
                  <label>Telefonlar</label>
                  {co.phones.map((ph, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <input style={{ flex: 1 }} value={ph.number} onChange={e => updatePhone(co.id, i, 'number', e.target.value)} placeholder="+998..." />
                      <input style={{ width: 80 }} value={ph.label} onChange={e => updatePhone(co.id, i, 'label', e.target.value)} placeholder="UZ/KR" />
                      <button className={s.btnDanger} style={{ minHeight: 36, padding: '0 12px', fontSize: 13 }} onClick={() => removePhone(co.id, i)}>×</button>
                    </div>
                  ))}
                  <button className={s.btnSecondary} style={{ alignSelf: 'flex-start', minHeight: 36, padding: '0 14px', fontSize: 13, marginTop: 4 }} onClick={() => addPhone(co.id)}>+ Telefon qo&apos;shish</button>
                </div>
                <div className={s.companySave}>
                  <button className={s.btnPrimary} onClick={save}>Saqlash</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </AdminShell>
  );
}
