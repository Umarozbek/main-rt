'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { loadFromStorage, saveToStorage, type ContactSubmission } from '../adminData';
import s from '../admin.module.css';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setContacts(loadFromStorage('rt-cms-contacts', []));
    setMounted(true);
  }, []);

  const markRead = useCallback((id: string) => {
    setContacts(prev => {
      const next = prev.map(c => c.id === id ? { ...c, read: true } : c);
      saveToStorage('rt-cms-contacts', next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setContacts(prev => {
      const next = prev.map(c => ({ ...c, read: true }));
      saveToStorage('rt-cms-contacts', next);
      return next;
    });
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => {
      const next = prev.filter(c => c.id !== id);
      saveToStorage('rt-cms-contacts', next);
      return next;
    });
  }, []);

  if (!mounted) return null;

  const unread = contacts.filter(c => !c.read).length;

  return (
    <AdminShell title="So'rovlar">
      <div className={s.sectionHead}>
        <h2 className={s.sectionTitle}>
          {contacts.length} ta so&apos;rov
          {unread > 0 && <span className={`${s.badge} ${s.badgeRed}`} style={{ marginLeft: 10 }}>{unread} yangi</span>}
        </h2>
        {unread > 0 && (
          <button className={s.btnSecondary} onClick={markAllRead}>Barchasini o&apos;qilgan deb belgilash</button>
        )}
      </div>

      {contacts.length === 0 ? (
        <div className={s.empty}>
          <div className={s.emptyIcon}>📭</div>
          <p>Hali so&apos;rovlar yo&apos;q</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Saytdagi kontakt formasi orqali yuborilgan so&apos;rovlar shu yerda ko&apos;rinadi.</p>
        </div>
      ) : (
        <table className={s.table}>
          <thead>
            <tr>
              <th>Holat</th>
              <th>Ism</th>
              <th>Telefon</th>
              <th>Xizmat</th>
              <th>Xabar</th>
              <th>Sana</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} style={{ fontWeight: c.read ? 400 : 600 }}>
                <td>
                  <span className={`${s.badge} ${c.read ? s.badgeGreen : s.badgeAmber}`}>
                    {c.read ? 'O\'qilgan' : 'Yangi'}
                  </span>
                </td>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.service}</td>
                <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message || '—'}</td>
                <td style={{ fontSize: 13, color: 'var(--muted)' }}>{c.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {!c.read && (
                      <button className={s.btnSecondary} style={{ minHeight: 32, padding: '0 10px', fontSize: 12 }} onClick={() => markRead(c.id)}>✓</button>
                    )}
                    <button className={s.btnDanger} style={{ minHeight: 32, padding: '0 10px', fontSize: 12 }} onClick={() => deleteContact(c.id)}>×</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
