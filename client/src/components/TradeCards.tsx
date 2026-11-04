'use client';

import { useI18n } from '@/i18n/context';

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

export default function TradeCards() {
  const { t } = useI18n();

  return (
    <section className="sec" id="trade" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head">
          <div>
            <span className="tag" dangerouslySetInnerHTML={{ __html: t('trTag') }} />
            <h2 className="rv" dangerouslySetInnerHTML={{ __html: t('trTitle') }} />
          </div>
        </div>
        <div className="trade">
          <article className="tcard rv">
            <div className="tvis">
              <img src="/img/ex-volvo.webp" alt="Volvo g'ildirakli ekskavatori" width={826} height={548} loading="lazy" />
            </div>
            <div className="tbody">
              <span className="cat" dangerouslySetInnerHTML={{ __html: t('r1') }} />
              <h3 dangerouslySetInnerHTML={{ __html: t('trExH') }} />
              <p dangerouslySetInnerHTML={{ __html: t('trExP') }} />
              <p className="ph" dangerouslySetInnerHTML={{ __html: t('trExPh') }} />
            </div>
          </article>
          <article className="tcard rv" style={{ '--d': '.1s' } as React.CSSProperties}>
            <div className="tvis photo wipe">
              <img src="/img/refinery.webp" alt="Moy ishlab chiqarish zavodi" width={1376} height={768} loading="lazy" style={{ objectPosition: 'center' }} />
            </div>
            <div className="tbody">
              <span className="cat" dangerouslySetInnerHTML={{ __html: t('r2') }} />
              <h3 dangerouslySetInnerHTML={{ __html: t('trImH') }} />
              <p dangerouslySetInnerHTML={{ __html: t('trImP') }} />
              <div className="links2">
                <a href="https://www.instagram.com/kortex_oil/">
                  <InstagramIcon />Instagram · @kortex_oil
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
