'use client';

import { useI18n } from '@/i18n/context';

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M8 7h9v9" /></svg>
);

const steps = [
  { key: 'ps1', num: '01' },
  { key: 'ps2', num: '02' },
  { key: 'ps3', num: '03' },
  { key: 'ps4', num: '04' },
  { key: 'ps5', num: '05' },
  { key: 'ps6', num: '06' },
];

export default function ProcessTimeline() {
  const { t } = useI18n();

  return (
    <section className="sec" id="process">
      <div className="wrap proc">
        <div className="proc-l">
          <span className="tag" dangerouslySetInnerHTML={{ __html: t('pTag') }} />
          <h2 className="rv" style={{ marginTop: 16 }} dangerouslySetInnerHTML={{ __html: t('pTitle') }} />
          <p className="rv" dangerouslySetInnerHTML={{ __html: t('pText') }} />
          <a className="btn btn-navy" href="#contact">
            <span dangerouslySetInnerHTML={{ __html: t('flAsk') }} />
            <span className="dot" aria-hidden="true"><ArrowIcon /></span>
          </a>
        </div>
        <ol className="tl" id="tl">
          <span className="tl-line" aria-hidden="true"><i id="tlFill" /></span>
          {steps.map((s) => (
            <li key={s.num} className="tl-item">
              <span className="tl-dot">{s.num}</span>
              <div>
                <h3 dangerouslySetInnerHTML={{ __html: t(`${s.key}t`) }} />
                <p dangerouslySetInnerHTML={{ __html: t(s.key) }} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
