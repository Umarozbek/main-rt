'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { DEFAULT_NEWS, loadFromStorage, saveToStorage, type NewsItem } from '../adminData';
import s from '../admin.module.css';

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return <div className={s.toast}>{msg}</div>;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setNews(loadFromStorage('rt-cms-news', DEFAULT_NEWS));
    setMounted(true);
  }, []);

  const update = useCallback((id: string, field: keyof NewsItem, value: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  }, []);

  const addNews = useCallback(() => {
    const item: NewsItem = {
      id: String(Date.now()),
      title: 'Yangi yangilik',
      date: new Date().toISOString().slice(0, 10),
      content: '',
      image: '',
    };
    setNews(prev => [item, ...prev]);
    setEditing(item.id);
  }, []);

  const removeNews = useCallback((id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  }, []);

  const save = useCallback(() => {
    saveToStorage('rt-cms-news', news);
    setToast('Yangiliklar saqlandi ✓');
  }, [news]);

  if (!mounted) return null;

  return (
    <AdminShell title="Yangiliklar">
      <div className={s.sectionHead}>
        <h2 className={s.sectionTitle}>{news.length} ta yangilik</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={s.btnSecondary} onClick={addNews}>+ Yangi qo&apos;shish</button>
          <button className={s.btnPrimary} onClick={save}>Saqlash</button>
        </div>
      </div>

      <div className={s.newsList}>
        {news.map(item => (
          <div key={item.id} className={s.newsCard}>
            <div className={s.newsImg}>
              {item.image ? (
                <img src={item.image} alt={item.title} />
              ) : (
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>Rasm yo&apos;q</span>
              )}
            </div>
            <div className={s.newsBody}>
              {editing === item.id ? (
                <>
                  <div className={s.field}>
                    <label>Sarlavha</label>
                    <input value={item.title} onChange={e => update(item.id, 'title', e.target.value)} />
                  </div>
                  <div className={s.field}>
                    <label>Sana</label>
                    <input type="date" value={item.date} onChange={e => update(item.id, 'date', e.target.value)} />
                  </div>
                  <div className={s.field}>
                    <label>Rasm URL</label>
                    <input value={item.image} onChange={e => update(item.id, 'image', e.target.value)} placeholder="/img/photo.jpg" />
                  </div>
                  <div className={s.field}>
                    <label>Matn</label>
                    <textarea value={item.content} onChange={e => update(item.id, 'content', e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className={s.btnPrimary} onClick={() => { setEditing(null); save(); }}>Tayyor</button>
                    <button className={s.btnDanger} onClick={() => removeNews(item.id)}>O&apos;chirish</button>
                  </div>
                </>
              ) : (
                <>
                  <div className={s.newsDate}>{item.date}</div>
                  <div className={s.newsTitle}>{item.title}</div>
                  <p style={{ fontSize: 14, color: 'var(--muted)' }}>{item.content || 'Matn yo\'q'}</p>
                  <button className={s.btnSecondary} onClick={() => setEditing(item.id)}>Tahrirlash</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </AdminShell>
  );
}
