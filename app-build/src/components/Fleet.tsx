'use client';

import { useI18n } from '@/i18n/context';
import { useRef, useCallback, useState, useEffect } from 'react';

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M8 7h9v9" /></svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
);

interface Excavator {
  id: string;
  brand: string;
  model: string;
  type: string;
  year: string;
  hours: string;
  price: string;
  weight: string;
  power: string;
  bucket: string;
  depth: string;
  image: string;
  status: 'active' | 'sold' | 'reserved';
}

const DEFAULT_FLEET = [
  { brand: 'VOLVO', name: 'Volvo', img: '/img/ex-volvo.webp', alt: "Volvo g'ildirakli ekskavatori", w: 826, h: 548, dir: 1, d: '0s' },
  { brand: 'HYUNDAI', name: 'Hyundai', img: '/img/ex-hyundai.webp', alt: "Hyundai g'ildirakli ekskavatori", w: 900, h: 611, dir: -1, d: '0.1s' },
  { brand: 'DOOSAN', name: 'Doosan', img: '/img/ex-doosan.webp', alt: "Doosan g'ildirakli ekskavatori", w: 466, h: 310, dir: 1, d: '0.2s' },
];

function getFleetData(): { list: typeof DEFAULT_FLEET; specs: Map<string, Excavator> } {
  try {
    const raw = localStorage.getItem('rt-cms-excavators');
    if (raw) {
      const excavators: Excavator[] = JSON.parse(raw);
      const active = excavators.filter(e => e.status === 'active');
      if (active.length > 0) {
        const specs = new Map<string, Excavator>();
        const list = active.map((exc, i) => {
          specs.set(exc.brand, exc);
          return {
            brand: exc.brand,
            name: exc.model || exc.brand,
            img: exc.image || `/img/ex-${exc.brand.toLowerCase()}.webp`,
            alt: `${exc.model || exc.brand} ${exc.type}`,
            w: 826, h: 548,
            dir: i % 2 === 0 ? 1 : -1,
            d: `${i * 0.1}s`,
          };
        });
        return { list, specs };
      }
    }
  } catch {}
  return { list: DEFAULT_FLEET, specs: new Map() };
}

export default function Fleet() {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [specData, setSpecData] = useState<Excavator | null>(null);
  const [fleet, setFleet] = useState(DEFAULT_FLEET);
  const [specsMap, setSpecsMap] = useState<Map<string, Excavator>>(new Map());

  useEffect(() => {
    const { list, specs } = getFleetData();
    setFleet(list);
    setSpecsMap(specs);
  }, []);

  const openSpec = useCallback((brand: string) => {
    const exc = specsMap.get(brand);
    setSpecData(exc || null);
    dialogRef.current?.showModal();
  }, [specsMap]);

  return (
    <>
      <section className="sec navy ribbed" id="fleet">
        <div className="wrap">
          <div className="head">
            <div>
              <span className="tag" dangerouslySetInnerHTML={{ __html: t('flTag') }} />
              <h2 className="rv" dangerouslySetInnerHTML={{ __html: t('flTitle') }} />
            </div>
          </div>
          <div className="fleet">
            {fleet.map((f) => {
              const exc = specsMap.get(f.brand);
              return (
                <article key={f.brand + f.name} className="fl rv" style={{ '--dir': f.dir, '--d': f.d } as React.CSSProperties} data-model={f.name}>
                  <div className="fl-img">
                    <img src={f.img} alt={f.alt} width={f.w} height={f.h} loading="lazy" />
                  </div>
                  <div className="fl-body">
                    <h3>{f.name}</h3>
                    <p>{exc?.type || t('flType')}</p>
                    <div className="fl-specs">
                      <span>{exc?.year || t('flYear')}</span>
                      <span>{exc?.hours ? `${exc.hours} h` : t('flHours')}</span>
                      <span>{exc?.price ? `$${exc.price}` : t('flPrice')}</span>
                    </div>
                    <div className="fl-actions">
                      <button type="button" className="fl-spec" onClick={() => openSpec(f.brand)}>
                        <span dangerouslySetInnerHTML={{ __html: t('flSpec') }} />
                      </button>
                      <a className="btn btn-orange fl-ask" href="#contact">
                        <span dangerouslySetInnerHTML={{ __html: t('flAsk') }} />
                        <span className="dot" aria-hidden="true"><ArrowIcon /></span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <dialog className="spec" id="spec" ref={dialogRef} aria-labelledby="specT">
        <form method="dialog" className="spec-in">
          <button className="spec-x" value="close" aria-label="Yopish"><CloseIcon /></button>
          <div className="spec-img">
            {specData?.image && <img src={specData.image} alt={specData.model} />}
          </div>
          <div className="spec-body">
            <span className="fl-brand">{specData?.brand}</span>
            <h3 id="specT">{specData?.model || specData?.brand}</h3>
            <p className="spec-type">{specData?.type || t('flType')}</p>
            <table className="spec-tbl">
              <tbody>
                <tr><th dangerouslySetInnerHTML={{ __html: t('spW') }} /><td>{specData?.weight || '[__ t]'}</td></tr>
                <tr><th dangerouslySetInnerHTML={{ __html: t('spP') }} /><td>{specData?.power || '[__ kVt]'}</td></tr>
                <tr><th dangerouslySetInnerHTML={{ __html: t('spB') }} /><td>{specData?.bucket || '[__ m³]'}</td></tr>
                <tr><th dangerouslySetInnerHTML={{ __html: t('spD') }} /><td>{specData?.depth || '[__ m]'}</td></tr>
                <tr><th dangerouslySetInnerHTML={{ __html: t('spY') }} /><td>{specData?.year || '[____]'}</td></tr>
                <tr><th dangerouslySetInnerHTML={{ __html: t('spH') }} /><td>{specData?.hours || '[____]'}</td></tr>
                <tr><th dangerouslySetInnerHTML={{ __html: t('spPr') }} /><td>{specData?.price ? `$${specData.price}` : '[$ ____]'}</td></tr>
              </tbody>
            </table>
            <p className="spec-note" dangerouslySetInnerHTML={{ __html: t('spNote') }} />
            <a className="btn btn-navy" href="#contact">
              <span dangerouslySetInnerHTML={{ __html: t('flAsk') }} />
              <span className="dot" aria-hidden="true"><ArrowIcon /></span>
            </a>
          </div>
        </form>
      </dialog>
    </>
  );
}
