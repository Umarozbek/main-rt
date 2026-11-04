'use client';

import { useI18n } from '@/i18n/context';

const logos = [
  { src: '/img/dream.jpg', alt: 'Dream Express', wide: false },
  { src: '/img/rtmotors.jpg', alt: 'RT Motors', wide: false },
  { src: '/img/medline.jpg', alt: 'RT Medline', wide: false },
  { src: '/img/akataxi.jpg', alt: 'aka taxi', wide: true },
  { src: '/img/ic-ship.webp', alt: 'RT Logistics', wide: false },
];

export default function BrandMarquee() {
  const { t } = useI18n();
  const doubled = [...logos, ...logos];

  return (
    <section className="brands" aria-label="Brendlar">
      <div className="brands-in">
        <span className="lbl" dangerouslySetInnerHTML={{ __html: t('bLbl') }} />
        <div className="marq">
          <div className="marq-track">
            {doubled.map((l, i) => (
              <img
                key={i}
                src={l.src}
                alt={l.alt}
                className={l.wide ? 'wide' : undefined}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
