'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AdminShell from '../AdminShell';
import { loadFromStorage, saveToStorage } from '../adminData';
import s from '../admin.module.css';

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return <div className={s.toast}>{msg}</div>;
}

export default function SettingsPage() {
  const [siteTitle, setSiteTitle] = useState('RT Holdings');
  const [siteDesc, setSiteDesc] = useState('');
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [toast, setToast] = useState('');
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadFromStorage<{ title: string; desc: string } | null>('rt-cms-site', null);
    if (saved) {
      setSiteTitle(saved.title);
      setSiteDesc(saved.desc);
    } else {
      setSiteDesc("Motor moylari, ekskavator eksporti, kargo, avtomobillar va tibbiyot — Janubiy Koreya va O'zbekiston o'rtasidagi ishonchli hamkor.");
    }
    setMounted(true);
  }, []);

  const saveSite = useCallback(() => {
    saveToStorage('rt-cms-site', { title: siteTitle, desc: siteDesc });
    setToast('Sayt ma\'lumotlari saqlandi ✓');
  }, [siteTitle, siteDesc]);

  const changePassword = useCallback(() => {
    setPwMsg('');
    const currentPw = loadFromStorage<string>('rt-cms-password', 'rtholdings2025');
    if (oldPw !== currentPw) {
      setPwMsg('Joriy parol noto\'g\'ri');
      return;
    }
    if (newPw.length < 6) {
      setPwMsg('Yangi parol kamida 6 ta belgi bo\'lishi kerak');
      return;
    }
    saveToStorage('rt-cms-password', newPw);
    setOldPw('');
    setNewPw('');
    setToast('Parol o\'zgartirildi ✓');
  }, [oldPw, newPw]);

  const exportData = useCallback(() => {
    const data: Record<string, unknown> = {};
    const keys = ['rt-cms-companies', 'rt-cms-translations', 'rt-cms-news', 'rt-cms-contacts', 'rt-cms-site'];
    keys.forEach(k => {
      try {
        const v = localStorage.getItem(k);
        if (v) data[k] = JSON.parse(v);
      } catch {}
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rt-holdings-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('Eksport qilindi ✓');
  }, []);

  const importData = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        Object.entries(data).forEach(([k, v]) => {
          localStorage.setItem(k, JSON.stringify(v));
        });
        setToast('Import qilindi ✓ — sahifani yangilang');
      } catch {
        setToast('Xatolik: fayl formati noto\'g\'ri');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  if (!mounted) return null;

  return (
    <AdminShell title="Sozlamalar">
      <div className={s.settingsGrid}>
        <div className={s.settingsCard}>
          <h3 className={s.settingsCardTitle}>Sayt ma&apos;lumotlari</h3>
          <div className={s.field} style={{ marginBottom: 14 }}>
            <label>Sayt nomi</label>
            <input value={siteTitle} onChange={e => setSiteTitle(e.target.value)} />
          </div>
          <div className={s.field} style={{ marginBottom: 14 }}>
            <label>Tavsif (SEO)</label>
            <textarea value={siteDesc} onChange={e => setSiteDesc(e.target.value)} />
          </div>
          <button className={s.btnPrimary} onClick={saveSite}>Saqlash</button>
        </div>

        <div className={s.settingsCard}>
          <h3 className={s.settingsCardTitle}>Parolni o&apos;zgartirish</h3>
          <div className={s.field} style={{ marginBottom: 14 }}>
            <label>Joriy parol</label>
            <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} />
          </div>
          <div className={s.field} style={{ marginBottom: 14 }}>
            <label>Yangi parol</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} />
          </div>
          {pwMsg && <p style={{ fontSize: 13, color: '#c0392b', marginBottom: 10 }}>{pwMsg}</p>}
          <button className={s.btnPrimary} onClick={changePassword}>O&apos;zgartirish</button>
        </div>

        <div className={s.settingsCard}>
          <h3 className={s.settingsCardTitle}>Ma&apos;lumotlar</h3>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 18 }}>
            Barcha CMS ma&apos;lumotlarini JSON fayl sifatida eksport qiling yoki import qiling.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className={s.btnPrimary} onClick={exportData}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Eksport
            </button>
            <button className={s.btnSecondary} onClick={importData}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              Import
            </button>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </div>
        </div>

        <div className={s.settingsCard}>
          <h3 className={s.settingsCardTitle}>Tizim haqida</h3>
          <div style={{ fontSize: 14, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><strong>Versiya:</strong> 1.0.0</div>
            <div><strong>Framework:</strong> Next.js 14</div>
            <div><strong>Saqlash:</strong> localStorage (client-side)</div>
            <div style={{ marginTop: 8, padding: '10px 14px', background: 'var(--ground)', borderRadius: 10, fontSize: 13 }}>
              ⚠️ Ma&apos;lumotlar brauzer localStorage&apos;da saqlanadi. Backend ulangandan so&apos;ng server bazasiga o&apos;tkaziladi.
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </AdminShell>
  );
}
