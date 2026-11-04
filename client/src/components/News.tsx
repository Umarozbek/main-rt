'use client';

import { useI18n } from '@/i18n/context';

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

export default function News() {
  const { t } = useI18n();

  return (
    <section className="sec" id="news" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head">
          <div>
            <span className="tag" dangerouslySetInnerHTML={{ __html: t('nwTag') }} />
            <h2 className="rv" dangerouslySetInnerHTML={{ __html: t('nwTitle') }} />
          </div>
        </div>
        <article className="news rv">
          <div className="news-img wipe">
            <img src="/img/truck.jpg" alt="Konteynerni jo'natishga tayyorlash" width={900} height={1200} loading="lazy" style={{ objectPosition: 'center 40%' }} />
          </div>
          <div className="news-txt">
            <div className="news-date">
              <span className="cal"><b>21</b><small dangerouslySetInnerHTML={{ __html: t('may') }} /></span>
              <span>Kortex Oil · <span dangerouslySetInnerHTML={{ __html: t('nwPlace2') }} /></span>
            </div>
            <h3 dangerouslySetInnerHTML={{ __html: t('nw2H') }} />
            <p dangerouslySetInnerHTML={{ __html: t('nw2P') }} />
            <div className="links2">
              <a href="https://www.instagram.com/kortex_oil/">
                <InstagramIcon />Instagram · @kortex_oil
              </a>
            </div>
          </div>
        </article>
        <article className="news rev rv">
          <div className="news-img wipe">
            <img src="/img/signing.jpg" alt="RT Holdings va World Oil Korea vakillari imzolangan shartnomalarni ko'rsatmoqda" width={1000} height={961} loading="lazy" />
          </div>
          <div className="news-txt">
            <div className="news-date">
              <span className="cal"><b>6</b><small dangerouslySetInnerHTML={{ __html: t('mar') }} /></span>
              <span>2025 · <span dangerouslySetInnerHTML={{ __html: t('nwPlace2') }} /></span>
            </div>
            <h3 dangerouslySetInnerHTML={{ __html: t('nwH') }} />
            <p dangerouslySetInnerHTML={{ __html: t('nwP') }} />
          </div>
        </article>
      </div>
    </section>
  );
}
