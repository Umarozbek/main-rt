'use client';

import { useI18n } from '@/i18n/context';

const nums = [
  { value: '7', to: 7, suffix: '', key: 'n1', dKey: 'n1d', d: undefined },
  { value: '186', to: 186, suffix: '+', key: 'n2', dKey: 'n2d', d: '.08s' },
  { value: '2025', to: null, suffix: '', key: 'n3', dKey: 'n3d', d: '.16s' },
  { value: '1000', to: 1000, suffix: '+', key: 'n4', dKey: 'n4d', d: '.24s' },
];

export default function Stats() {
  const { t } = useI18n();

  return (
    <section className="sec navy ribbed" id="numbers">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="tag" dangerouslySetInnerHTML={{ __html: t('nTag') }} />
            <h2 className="rv" dangerouslySetInnerHTML={{ __html: t('nTitle') }} />
          </div>
        </div>
        <div className="nums">
          {nums.map((n) => (
            <div key={n.key} className="num rv" style={n.d ? { '--d': n.d } as React.CSSProperties : undefined}>
              <div className="n">
                {n.to !== null ? (
                  <><span className="count" data-to={n.to}>{n.value}</span>{n.suffix}</>
                ) : (
                  n.value
                )}
              </div>
              <h3 dangerouslySetInnerHTML={{ __html: t(n.key) }} />
              <p dangerouslySetInnerHTML={{ __html: t(n.dKey) }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
