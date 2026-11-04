'use client';

import { useI18n } from '@/i18n/context';

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

export default function CompanyCards() {
  const { t } = useI18n();

  return (
    <section className="sec" id="companies" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head">
          <div>
            <span className="tag" dangerouslySetInnerHTML={{ __html: t('cTag') }} />
            <h2 className="rv" dangerouslySetInnerHTML={{ __html: t('cTitle') }} />
          </div>
          <p className="rv" dangerouslySetInnerHTML={{ __html: t('cText') }} />
        </div>
        <div className="cos">
          {/* Kortex Oil */}
          <article className="co rv">
            <div className="logo-box">
              <span className="cat" dangerouslySetInnerHTML={{ __html: t('catOil') }} />
              <img src="/img/kortex-oil-logo.png" alt="Kortex Oil" width={920} height={560} />
            </div>
            <div className="body">
              <h3>Kortex Oil</h3>
              <p dangerouslySetInnerHTML={{ __html: t('coKo') }} />
              <dl className="co-info">
                <div><dt>Instagram</dt><dd><a href="https://www.instagram.com/kortex_oil/">@kortex_oil</a></dd></div>
                <div><dt>Email</dt><dd><a href="mailto:kortexoil.kr@gmail.com">kortexoil.kr@gmail.com</a></dd></div>
                <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+998945639595">+998 94 563 95 95</a></dd></div>
                <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') + ' KR' }} /><dd><a href="tel:+821029898641">+82 10 2989 8641</a></dd></div>
              </dl>
            </div>
          </article>

          {/* Dream Express */}
          <article className="co rv" style={{ '--d': '.08s' } as React.CSSProperties}>
            <div className="logo-box">
              <span className="cat" dangerouslySetInnerHTML={{ __html: t('catLog') }} />
              <img src="/img/dream.jpg" alt="Dream Express" width={480} height={207} loading="lazy" />
            </div>
            <div className="body">
              <h3>Dream Express</h3>
              <p dangerouslySetInnerHTML={{ __html: t('coDr') }} />
              <p className="slogan" dangerouslySetInnerHTML={{ __html: t('coDrS') }} />
              <dl className="co-info">
                <div><dt>Instagram</dt><dd><a href="https://www.instagram.com/expressbts_kr/">@expressbts_kr</a></dd></div>
                <div><dt>Email</dt><dd><a href="mailto:dreamexpresskr@gmail.com">dreamexpresskr@gmail.com</a></dd></div>
                <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+821029858641">+82 10 2985 8641</a></dd></div>
                <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') + ' 2' }} /><dd><a href="tel:+821029268641">+82 10 2926 8641</a></dd></div>
              </dl>
            </div>
          </article>

          {/* RT Motors */}
          <article className="co rv" style={{ '--d': '.16s' } as React.CSSProperties}>
            <div className="logo-box">
              <span className="cat" dangerouslySetInnerHTML={{ __html: t('catAuto') }} />
              <img src="/img/rtmotors.jpg" alt="RT Motors" width={480} height={289} loading="lazy" />
            </div>
            <div className="body">
              <h3>RT Motors</h3>
              <p dangerouslySetInnerHTML={{ __html: t('coMo') }} />
              <p className="slogan" dangerouslySetInnerHTML={{ __html: t('coMoS') }} />
              <dl className="co-info">
                <div><dt dangerouslySetInnerHTML={{ __html: t('lWeb') }} /><dd><a href="https://rt-motors.com">rt-motors.com</a></dd></div>
                <div><dt>Instagram</dt><dd><a href="https://www.instagram.com/rtmotors_trade/">@rtmotors_trade</a></dd></div>
                <div><dt>Email</dt><dd><a href="mailto:rtmotorssales@gmail.com">rtmotorssales@gmail.com</a></dd></div>
                <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+821084658085">+82 10 8465 8085</a></dd></div>
              </dl>
            </div>
          </article>

          {/* RT Medline */}
          <article className="co rv">
            <div className="logo-box">
              <span className="cat" dangerouslySetInnerHTML={{ __html: t('catMed') }} />
              <img src="/img/medline.jpg" alt="RT Medline" width={420} height={454} loading="lazy" />
            </div>
            <div className="body">
              <h3>RT Medline</h3>
              <p dangerouslySetInnerHTML={{ __html: t('coMe') }} />
              <dl className="co-info">
                <div><dt dangerouslySetInnerHTML={{ __html: t('lWeb') }} /><dd><a href="https://rtmedline.uz">rtmedline.uz</a></dd></div>
                <div><dt>Instagram</dt><dd><a href="https://www.instagram.com/rt_medline/">@rt_medline</a></dd></div>
                <div><dt>Email</dt><dd><a href="mailto:rtmedline@gmail.com">rtmedline@gmail.com</a></dd></div>
                <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+998940342222">+998 94 034 22 22</a></dd></div>
              </dl>
            </div>
          </article>

          {/* aka taxi */}
          <article className="co rv" style={{ '--d': '.08s' } as React.CSSProperties}>
            <div className="logo-box">
              <span className="cat" dangerouslySetInnerHTML={{ __html: t('catMob') }} />
              <img src="/img/akataxi.jpg" alt="aka taxi by RT Holdings" width={480} height={246} loading="lazy" />
            </div>
            <div className="body">
              <h3>aka taxi</h3>
              <p dangerouslySetInnerHTML={{ __html: t('coTaxi') }} />
              <dl className="co-info">
                <div><dt>Instagram</dt><dd><a href="https://www.instagram.com/akataxi.uz/">@akataxi.uz</a></dd></div>
                <div><dt>Telegram</dt><dd><a href="https://t.me/akataxi">akataxi</a></dd></div>
                <div><dt>Email</dt><dd><a href="mailto:akataxi.uz@gmail.com">akataxi.uz@gmail.com</a></dd></div>
                <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+998999211166">+998 99 921 11 66</a></dd></div>
              </dl>
            </div>
          </article>

          {/* RT Logistics */}
          <article className="co rv" style={{ '--d': '.16s' } as React.CSSProperties}>
            <div className="logo-box">
              <span className="cat" dangerouslySetInnerHTML={{ __html: t('catLog') }} />
              <img src="/img/rt-logistics-logo.jpg" alt="RT Logistics" width={900} height={1200} style={{ maxHeight: '110px', maxWidth: '95%', marginTop: '-10px' }} />
            </div>
            <div className="body">
              <h3>RT Logistics</h3>
              <p dangerouslySetInnerHTML={{ __html: t('coRl') }} />
              <dl className="co-info">
                <div><dt>Instagram</dt><dd><a href="https://www.instagram.com/rt_logistics/">@rt_logistics</a></dd></div>
                <div><dt>Email</dt><dd><a href="mailto:rtholdings2020@gmail.com">rtholdings2020@gmail.com</a></dd></div>
                <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') + ' UZ' }} /><dd><a href="tel:+998990114177">+998 99 011 41 77</a></dd></div>
                <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') + ' KR' }} /><dd><a href="tel:+821096879796">+82 10 9687 9796</a></dd></div>
              </dl>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
