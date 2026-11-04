'use client';

import Link from 'next/link';
import AdminShell from '../AdminShell';
import { loadFromStorage, type ContactSubmission } from '../adminData';
import s from '../admin.module.css';

export default function Dashboard() {
  const contacts = loadFromStorage<ContactSubmission[]>('rt-cms-contacts', []);
  const unread = contacts.filter(c => !c.read).length;

  const stats = [
    { n: '13', label: 'Sayt bo\'limlari', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z' },
    { n: '7', label: 'Kompaniyalar', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16' },
    { n: '3', label: 'Tillar (UZ/RU/EN)', icon: 'M3 5h12M9 3v2m1 9.5A18 18 0 016.4 9m6 9h7M11 21l5-10 5 10' },
    { n: String(unread), label: "Yangi so'rovlar", icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8' },
  ];

  const quickLinks = [
    { href: '/admin/sections', label: 'Sayt bo\'limlarini tahrirlash', desc: 'Rasmlar, matnlar va ma\'lumotlar' },
    { href: '/admin/contacts', label: 'So\'rovlarni ko\'rish', desc: unread > 0 ? `${unread} ta yangi so'rov` : 'Barcha so\'rovlar' },
    { href: '/admin/settings', label: 'Sozlamalar', desc: 'Sayt nomi, parol, eksport/import' },
    { href: '/', label: 'Saytni ko\'rish →', desc: 'Asosiy sahifani ochish' },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className={s.cardGrid}>
        {stats.map((st, i) => (
          <div key={i} className={s.card}>
            <div className={s.cardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={st.icon} />
              </svg>
            </div>
            <div className={s.cardNumber}>{st.n}</div>
            <div className={s.cardLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div className={s.sectionHead}>
        <h2 className={s.sectionTitle}>Tezkor havolalar</h2>
      </div>
      <div className={s.quickLinks}>
        {quickLinks.map(ql => (
          <Link key={ql.href} href={ql.href} className={s.quickLink}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{ql.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{ql.desc}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
