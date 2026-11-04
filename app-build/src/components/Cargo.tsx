'use client';

import { useI18n } from '@/i18n/context';
import { LAND_PATH } from './worldMapData';

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const arcs = [
  { d: 'M825.0 137.5 Q744.7 78.5 664.4 123.6', dl: '0.00s', cx: 664.4, cy: 123.6 },
  { d: 'M825.0 137.5 Q700.9 -1.6 576.7 70.4', dl: '0.18s', cx: 576.7, cy: 70.4 },
  { d: 'M825.0 137.5 Q725.4 80.3 625.8 182.2', dl: '0.36s', cx: 625.8, cy: 182.2 },
  { d: 'M825.0 137.5 Q688.9 48.4 552.8 124.7', dl: '0.54s', cx: 552.8, cy: 124.7 },
  { d: 'M825.0 137.5 Q662.5 -4.0 500.0 88.0', dl: '0.72s', cx: 500.0, cy: 88.0 },
  { d: 'M825.0 137.5 Q516.6 -37.0 208.3 135.7', dl: '0.90s', cx: 208.3, cy: 135.7 },
  { d: 'M825.0 137.5 Q795.9 110.1 766.7 216.3', dl: '1.08s', cx: 766.7, cy: 216.3 },
];

const cities: { key: string; x: number; y: number; anchor: 'middle' | 'end' | 'start' }[] = [
  { key: 'w1', x: 664.4, y: 147.6, anchor: 'middle' },
  { key: 'w2', x: 576.7, y: 56.4, anchor: 'middle' },
  { key: 'w3', x: 625.8, y: 206.2, anchor: 'middle' },
  { key: 'w4', x: 542.8, y: 144.7, anchor: 'end' },
  { key: 'w5', x: 488.0, y: 80.0, anchor: 'end' },
  { key: 'w6', x: 208.3, y: 159.7, anchor: 'middle' },
  { key: 'w7', x: 766.7, y: 242.3, anchor: 'middle' },
];

const steps = [
  { num: '01', tKey: 's1t', pKey: 's1', d: undefined },
  { num: '02', tKey: 's2t', pKey: 's2', d: '.08s' },
  { num: '03', tKey: 's3t', pKey: 's3', d: '.16s' },
  { num: '04', tKey: 's4t', pKey: 's4', d: '.24s' },
];

export default function Cargo() {
  const { t } = useI18n();

  return (
    <section className="sec navy ribbed" id="cargo">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="tag" dangerouslySetInnerHTML={{ __html: t('kTag') }} />
            <h2 className="rv" dangerouslySetInnerHTML={{ __html: t('kTitle') }} />
          </div>
          <p className="rv" dangerouslySetInnerHTML={{ __html: t('kText') }} />
        </div>
        <div className="cargo-grid">
          <div className="cargo-poster rv wipe">
            <img src="/img/cargo.jpg" alt="Koreyadan O'zbekistonga cargo xizmati plakati" width={1000} height={1000} loading="lazy" />
            <span className="shine" aria-hidden="true" />
            <div className="fchip fc1">
              <b><span className="count" data-to="186">186</span>+</b>
              <span dangerouslySetInnerHTML={{ __html: t('n2') }} />
            </div>
            <div className="fchip fc2">
              <b><span className="count" data-to="1000">1000</span>+</b>
              <span dangerouslySetInnerHTML={{ __html: t('n4') }} />
            </div>
          </div>
          <div className="cargo-side">
            <div className="ph-img rv wipe">
              <img src="/img/container.jpg" alt="Konteynerga joylangan yuklar" width={900} height={1200} loading="lazy" />
              <span dangerouslySetInnerHTML={{ __html: t('k1') }} />
            </div>
            <div className="ph-img rv wipe" style={{ '--d': '.1s' } as React.CSSProperties}>
              <img src="/img/truck.jpg" alt="Konteynerni tekshirish va jo'natish" width={900} height={1200} loading="lazy" />
              <span dangerouslySetInnerHTML={{ __html: t('k2') }} />
            </div>
          </div>
          <div className="route rv" id="route">
            <svg viewBox="0 0 1000 440" role="img" aria-label="Koreyadan dunyo bo'ylab yo'nalishlar xaritasi">
              <path className="land" d={LAND_PATH} />
              {arcs.map((a, i) => (
                <g key={i}>
                  <path className="arc" d={a.d} />
                  <path className="lit" style={{ '--dl': a.dl } as React.CSSProperties} d={a.d} />
                </g>
              ))}
              <g id="movers" />
              {arcs.map((a, i) => (
                <circle key={i} className="dst" cx={a.cx} cy={a.cy} r={5} />
              ))}
              <circle className="pulse" cx={825.0} cy={137.5} r={9} />
              <circle className="hub" cx={825.0} cy={137.5} r={9} />
              <text className="city hubl" x={841.0} y={142.5} dangerouslySetInnerHTML={{ __html: t('kr') }} />
              {cities.map((c) => (
                <text key={c.key} className="city" x={c.x} y={c.y} textAnchor={c.anchor} dangerouslySetInnerHTML={{ __html: t(c.key) }} />
              ))}
              <text className="sub" x={990} y={430} textAnchor="end" dangerouslySetInnerHTML={{ __html: t('kMid') }} />
            </svg>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <div key={s.num} className="step rv" style={s.d ? { '--d': s.d } as React.CSSProperties : undefined}>
                <span className="n">{s.num}</span>
                <h3 dangerouslySetInnerHTML={{ __html: t(s.tKey) }} />
                <p dangerouslySetInnerHTML={{ __html: t(s.pKey) }} />
              </div>
            ))}
          </div>
        </div>
        <div className="partner">
          <b>Dream Express</b>
          <span dangerouslySetInnerHTML={{ __html: t('kPart2') }} />
          <a href="https://www.instagram.com/expressbts_kr/">
            <InstagramIcon />Instagram · @expressbts_kr
          </a>
        </div>
      </div>
    </section>
  );
}
