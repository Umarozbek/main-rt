'use client';

import { useI18n } from '@/i18n/context';

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M8 7h9v9" /></svg>
);

export default function AkaApps() {
  const { t } = useI18n();

  return (
    <section className="sec" id="aka">
      <div className="wrap aka">
        <div className="aka-intro">
          <span className="tag" dangerouslySetInnerHTML={{ __html: t('tTag') }} />
          <h2 className="rv" dangerouslySetInnerHTML={{ __html: t('tTitle') }} />
          <p style={{ color: 'var(--muted)' }} dangerouslySetInnerHTML={{ __html: t('tText') }} />
          <div className="links2" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <a className="btn btn-navy" href="https://www.instagram.com/akataxi.uz/">
              <span>Instagram</span>
              <span className="dot" aria-hidden="true"><ArrowIcon /></span>
            </a>
            <a className="btn btn-orange" href="https://t.me/akataxi">
              <span>Telegram</span>
              <span className="dot" aria-hidden="true"><ArrowIcon /></span>
            </a>
          </div>
        </div>
        <div className="aka-apps">
          <article className="app t rv">
            <span className="ring" aria-hidden="true" />
            <div className="q" dangerouslySetInnerHTML={{ __html: t('atQ') }} />
            <p dangerouslySetInnerHTML={{ __html: t('atP') }} />
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('at1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('at2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('at3') }} />
            </ul>
          </article>
          <article className="app d rv" style={{ '--d': '.1s' } as React.CSSProperties}>
            <span className="ring" aria-hidden="true" />
            <div className="q" dangerouslySetInnerHTML={{ __html: t('adQ') }} />
            <p dangerouslySetInnerHTML={{ __html: t('adP') }} />
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('ad1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('ad2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('ad3') }} />
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
