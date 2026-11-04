'use client';

import { useI18n } from '@/i18n/context';

export default function About() {
  const { t } = useI18n();

  return (
    <section className="sec" id="about">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="tag" dangerouslySetInnerHTML={{ __html: t('aTag') }} />
            <h2 className="rv" dangerouslySetInnerHTML={{ __html: t('aTitle') }} />
          </div>
        </div>
        <div className="about">
          <div className="about-txt">
            <p className="big rv" dangerouslySetInnerHTML={{ __html: t('aBig') }} />
            <p className="body rv" dangerouslySetInnerHTML={{ __html: t('aBody') }} />
            <div className="pillars">
              <div className="pillar rv">
                <div className="ic ic-sea">
                  <span className="waves" aria-hidden="true" />
                  <img className="pl-ship" src="/img/ic-ship.webp" alt="" loading="lazy" />
                </div>
                <h3 dangerouslySetInnerHTML={{ __html: t('p1t') }} />
                <p dangerouslySetInnerHTML={{ __html: t('p1') }} />
              </div>
              <div className="pillar rv" style={{ '--d': '.12s' } as React.CSSProperties}>
                <div className="ic ic-road">
                  <span className="road2" aria-hidden="true" />
                  <img className="pl-truck" src="/img/ic-tanker.webp" alt="" loading="lazy" />
                </div>
                <h3 dangerouslySetInnerHTML={{ __html: t('p3t') }} />
                <p dangerouslySetInnerHTML={{ __html: t('p3') }} />
              </div>
              <div className="pillar rv" style={{ '--d': '.24s' } as React.CSSProperties}>
                <div className="ic ic-road">
                  <span className="road2" aria-hidden="true" />
                  <img className="pl-ex" src="/img/ic-excavator.webp" alt="" loading="lazy" />
                </div>
                <h3 dangerouslySetInnerHTML={{ __html: t('p4t') }} />
                <p dangerouslySetInnerHTML={{ __html: t('p4') }} />
              </div>
            </div>
          </div>
          <div className="about-img rv wipe">
            <img src="/img/container.jpg" alt="Mahsulot bilan to'ldirilgan konteyner" width={900} height={1200} loading="lazy" />
            <span className="badge" dangerouslySetInnerHTML={{ __html: t('aBadge') }} />
          </div>
        </div>
      </div>
    </section>
  );
}
