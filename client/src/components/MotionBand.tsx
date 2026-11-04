'use client';

import { useI18n } from '@/i18n/context';

const bandWords: Record<string, string[]> = {
  uz: ['Import', 'Eksport', 'Logistika', 'Mobillik'],
  ru: ['Импорт', 'Экспорт', 'Логистика', 'Мобильность'],
  en: ['Import', 'Export', 'Logistics', 'Mobility'],
};

export default function MotionBand() {
  const { lang } = useI18n();
  const words = bandWords[lang] || bandWords.uz;
  const repeated = [...words, ...words, ...words, ...words];

  return (
    <section className="band" aria-hidden="true">
      <div className="band-row" id="band1">
        {repeated.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
      <div className="band-row o" id="band2">
        {repeated.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </section>
  );
}
