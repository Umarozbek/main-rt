'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useI18n } from '@/i18n/context';

const BRANDS = ['Volvo', 'Hyundai', 'Doosan'] as const;
const SLIDE_DIRS = [1, 1, 1, -1]; // truck (slide 3) comes from left
const MODEL_DIRS = [1, -1, 1]; // Hyundai comes from left

const EXH: Record<number, [number, number][]> = {
  0: [], 1: [[29, 2]], 2: [[78, 4]], 3: [[53, 1], [71, 3]],
};
const WAKE: Record<number, [number, number][]> = { 2: [[7, 86], [12, 90]] };
const TIRE: Record<number, [number, number][]> = {
  0: [[45, 97], [70, 97], [92, 97]], 1: [[22, 95], [57, 95], [88, 95]], 3: [[9, 94], [39, 94], [70, 94]],
};

const ROUTE_KEYS = [
  { rt: 'r1', rs: 'r1s' },
  { rt: 'r2', rs: 'r2s' },
  { rt: 'r3', rs: 'r3s' },
  { rt: 'r4', rs: 'r4s' },
];

function letters(text: string, lineIdx: number) {
  return text.split('').map((c, i) => (
    <span key={i} className="ch" style={{ '--c': i, '--l': lineIdx } as React.CSSProperties}>
      {c === ' ' ? ' ' : c}
    </span>
  ));
}

export default function Hero() {
  const { t, hero } = useI18n();
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [mdl, setMdl] = useState(0);
  const [oldMdl, setOldMdl] = useState<number | null>(null);
  const [driving, setDriving] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [giantKey, setGiantKey] = useState(0);
  const [copyKey, setCopyKey] = useState(0);
  const [activeHs, setActiveHs] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLHeadingElement>(null);
  const routesRef = useRef<HTMLDivElement>(null);
  const hxRef = useRef<HTMLElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdRef = useRef(0);
  const curRef = useRef(0);
  const mdlRef = useRef(0);
  const drivingRef = useRef(false);
  const lastOutRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Sync refs
  useEffect(() => { curRef.current = cur; }, [cur]);
  useEffect(() => { mdlRef.current = mdl; }, [mdl]);

  const spawnDust = useCallback(() => {
    if (reduceRef.current) return;
    const sp = sparksRef.current;
    if (!sp) return;
    sp.innerHTML = '';
    setTimeout(() => {
      for (let k = 0; k < 14; k++) {
        const d = document.createElement('i');
        d.className = 'dust';
        const left = Math.random() < 0.5;
        d.style.left = (left ? 20 + Math.random() * 25 : 55 + Math.random() * 25) + '%';
        d.style.setProperty('--dx', ((left ? -1 : 1) * (40 + Math.random() * 120)) + 'px');
        d.style.setProperty('--dy', (-10 - Math.random() * 50) + 'px');
        d.style.setProperty('--sc', (2 + Math.random() * 3).toFixed(2));
        d.style.animationDelay = (Math.random() * 0.15) + 's';
        sp.appendChild(d);
      }
    }, 1250);
  }, []);

  const setDrivingState = useCallback((ms: number) => {
    drivingRef.current = true;
    setDriving(true);
    const timer = setTimeout(() => {
      drivingRef.current = false;
      setDriving(false);
    }, ms);
    if (!reduceRef.current) {
      setTimeout(() => {
        tireDust(curRef.current, 3);
      }, 1150);
    }
    return () => clearTimeout(timer);
  }, []);

  function tireDust(slideIdx: number, strength: number) {
    const stage = stageRef.current;
    if (!stage) return;
    const sl = stage.querySelectorAll('.slide')[slideIdx] as HTMLElement;
    if (!sl) return;
    const vis = sl.querySelector('.vis') as HTMLElement;
    if (!vis) return;
    const dir = parseFloat(getComputedStyle(sl).getPropertyValue('--dir')) || 1;
    (TIRE[slideIdx] || []).forEach(([px, py]) => {
      for (let k = 0; k < strength; k++) {
        const d = document.createElement('i');
        d.className = 'smoke tire';
        d.style.left = (px + (Math.random() * 4 - 2)) + '%';
        d.style.top = py + '%';
        d.style.setProperty('--sx', (dir * (60 + Math.random() * 150)) + 'px');
        d.style.setProperty('--sy', (-8 - Math.random() * 45) + 'px');
        d.style.setProperty('--sc', (3 + Math.random() * 3.5).toFixed(2));
        d.style.setProperty('--t', (1.2 + Math.random() * 0.8).toFixed(2) + 's');
        vis.appendChild(d);
        setTimeout(() => d.remove(), 2200);
      }
    });
  }

  function emit(slideIdx: number, heavy: boolean) {
    const stage = stageRef.current;
    if (!stage) return;
    const sl = stage.querySelectorAll('.slide')[slideIdx] as HTMLElement;
    if (!sl) return;
    const vis = sl.querySelector('.vis') as HTMLElement;
    if (!vis) return;
    const dir = parseFloat(getComputedStyle(sl).getPropertyValue('--dir')) || 1;

    const exhPts = (slideIdx === 0 && mdlRef.current !== 0) ? [] : (EXH[slideIdx] || []);
    exhPts.forEach(([px, py]) => {
      const d = document.createElement('i');
      d.className = 'smoke' + (heavy ? '' : ' light');
      d.style.left = px + '%';
      d.style.top = py + '%';
      d.style.setProperty('--sx', (dir * (heavy ? 90 + Math.random() * 140 : 20 + Math.random() * 50)) + 'px');
      d.style.setProperty('--sy', (-(heavy ? 50 : 70) - Math.random() * 90) + 'px');
      d.style.setProperty('--sc', (heavy ? 4 + Math.random() * 3 : 2.5 + Math.random() * 2.5).toFixed(2));
      d.style.setProperty('--t', (heavy ? 1.8 : 2.8) + 's');
      vis.appendChild(d);
      setTimeout(() => d.remove(), 3000);
    });

    (WAKE[slideIdx] || []).forEach(([px, py]) => {
      if (!heavy && Math.random() < 0.5) return;
      const w = document.createElement('i');
      w.className = 'smoke wake';
      w.style.left = px + '%';
      w.style.top = py + '%';
      w.style.setProperty('--sx', (dir * (40 + Math.random() * 80)) + 'px');
      w.style.setProperty('--sy', (Math.random() * 16 - 4) + 'px');
      w.style.setProperty('--sc', (2 + Math.random() * 2).toFixed(2));
      w.style.setProperty('--t', '1.6s');
      vis.appendChild(w);
      setTimeout(() => w.remove(), 1800);
    });
  }

  // Smoke emission interval
  useEffect(() => {
    if (reduceRef.current) return;
    const iv = setInterval(() => {
      if (document.hidden) return;
      const hx = hxRef.current;
      if (!hx) return;
      const r = hx.getBoundingClientRect();
      if (r.bottom < 0) return;
      emit(curRef.current, drivingRef.current);
      if (drivingRef.current) {
        tireDust(curRef.current, 1);
        if (lastOutRef.current !== null) {
          emit(lastOutRef.current, true);
          tireDust(lastOutRef.current, 1);
        }
      }
    }, 140);
    return () => clearInterval(iv);
  }, []);

  const go = useCallback((n: number) => {
    if (n === curRef.current) return;
    const oldSlide = curRef.current;
    lastOutRef.current = oldSlide;
    setPrev(oldSlide);
    setTimeout(() => {
      setPrev(p => p === oldSlide ? null : p);
    }, 1100);
    curRef.current = n;
    setCur(n);
    holdRef.current = 0;
    setGiantKey(k => k + 1);
    setCopyKey(k => k + 1);
    setActiveHs(null);

    if (oldSlide === 0) {
      setTimeout(() => {
        setMdl(0);
        mdlRef.current = 0;
        setOldMdl(null);
      }, 1150);
    }

    setDrivingState(1500);
    spawnDust();
    setTimeout(() => { lastOutRef.current = null; }, 1100);
  }, [setDrivingState, spawnDust]);

  const pickModel = useCallback((n: number, auto?: boolean) => {
    if (n === mdlRef.current) return;
    if (curRef.current !== 0) go(0);
    const old = mdlRef.current;
    setOldMdl(old);
    setTimeout(() => setOldMdl(om => om === old ? null : om), 1050);
    mdlRef.current = n;
    setMdl(n);

    if (!reduceRef.current) {
      setRolling(true);
      let k = 0;
      const iv = setInterval(() => {
        tireDust(0, 1);
        if (++k > 8) {
          clearInterval(iv);
          setRolling(false);
          tireDust(0, 3);
        }
      }, 140);
    }
    if (!auto) play();
  }, [go]);

  function play() {
    if (timerRef.current) clearInterval(timerRef.current);
    holdRef.current = 0;
    document.documentElement.style.setProperty('--dur', (curRef.current === 0 ? 9 : 6) + 's');
    if (reduceRef.current) return;
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      if (curRef.current === 0) {
        if (mdlRef.current < 2) {
          pickModel(mdlRef.current + 1, true);
          return;
        }
        go(1);
        return;
      }
      holdRef.current++;
      if (holdRef.current >= 2) {
        holdRef.current = 0;
        go((curRef.current + 1) % 4);
      }
    }, 3000);
  }

  // Start timer on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--dur', '9s');
    setDrivingState(1500);
    spawnDust();
    play();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update bar duration when slide changes
  useEffect(() => {
    document.documentElement.style.setProperty('--dur', (cur === 0 ? 9 : 6) + 's');
  }, [cur]);

  // Giant headline fitting
  useEffect(() => {
    function fitGiant() {
      const g = giantRef.current;
      const ro = routesRef.current;
      if (!g || !ro) return;
      if (window.innerWidth < 901) {
        g.style.removeProperty('--gfs');
        return;
      }
      const roRect = ro.getBoundingClientRect();
      const gLeft = g.getBoundingClientRect().left;
      const avail = roRect.left - gLeft - 24;
      g.style.setProperty('--gfs', '200px');
      const gl1 = g.querySelector('.g1') as HTMLElement;
      const gl2 = g.querySelector('.g2') as HTMLElement;
      const w = Math.max(gl1?.scrollWidth || 1, gl2?.scrollWidth || 1) || 1;
      const size = Math.max(70, Math.min(140, 200 * avail / w * 0.78, (window.innerHeight - 200) * 0.3));
      g.style.setProperty('--gfs', size.toFixed(1) + 'px');
    }
    fitGiant();
    window.addEventListener('resize', fitGiant);
    if (document.fonts?.ready) document.fonts.ready.then(fitGiant);
    return () => window.removeEventListener('resize', fitGiant);
  }, [giantKey, hero]);

  // Scroll exit parallax (desktop only)
  useEffect(() => {
    if (reduceRef.current) return;
    const hx = hxRef.current;
    const st = stageRef.current;
    const gi = giantRef.current;
    const ro = routesRef.current;
    if (!hx || !st || !gi || !ro) return;

    const wide = window.matchMedia('(min-width:901px)');
    const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    let pmx = 0, pmy = 0, heroP = 0;

    function apply() {
      if (!st || !gi || !ro) return;
      const p = heroP;
      const e = p * p * (3 - 2 * p); // smoothstep
      const fade = Math.max(0, 1 - Math.max(0, (p - 0.45) / 0.5));
      st.style.transform = `translate(${pmx * 22 + e * 120}px,${pmy * 12 - e * window.innerHeight * 0.75}px) rotate(${-e * 9}deg) scale(${1 - e * 0.32})`;
      st.style.opacity = String(fade);
      gi.style.transform = `translate(${-pmx * 26 - e * 60}px,${-pmy * 14 + e * 140}px)`;
      gi.style.opacity = String(Math.max(0, 1 - p * 1.3));
      ro.style.transform = `translate(${pmx * 10}px,${pmy * 6 - e * 80}px)`;
      ro.style.opacity = String(Math.max(0, 1 - p * 2));
    }

    let heroTick = false;
    function onScroll() {
      if (heroTick) return;
      heroTick = true;
      requestAnimationFrame(() => {
        heroTick = false;
        const h = hx!.offsetHeight || 1;
        heroP = wide.matches ? Math.min(1, Math.max(0, window.scrollY / (h * 0.8))) : 0;
        apply();
      });
    }

    function onPointerMove(e: PointerEvent) {
      const r = hx!.getBoundingClientRect();
      pmx = (e.clientX - r.left) / r.width - 0.5;
      pmy = (e.clientY - r.top) / r.height - 0.5;
      apply();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    if (fine) hx.addEventListener('pointermove', onPointerMove as EventListener);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (fine) hx.removeEventListener('pointermove', onPointerMove as EventListener);
      // Reset styles on cleanup
      if (st) { st.style.transform = ''; st.style.opacity = ''; }
      if (gi) { gi.style.transform = ''; gi.style.opacity = ''; }
      if (ro) { ro.style.transform = ''; ro.style.opacity = ''; }
    };
  }, []);

  // Swipe handling
  useEffect(() => {
    const st = stageRef.current;
    if (!st) return;
    let tx: number | null = null;
    let ty: number | null = null;

    function onTouchStart(e: TouchEvent) {
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      if (tx === null || ty === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      const dy = e.changedTouches[0].clientY - ty;
      tx = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        go((curRef.current + (dx < 0 ? 1 : 3)) % 4);
        play();
      }
    }

    st.addEventListener('touchstart', onTouchStart, { passive: true });
    st.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      st.removeEventListener('touchstart', onTouchStart);
      st.removeEventListener('touchend', onTouchEnd);
    };
  }, [go]);

  const slideData = hero;
  const gLines = slideData[cur]?.g || ['', ''];
  const hotspots = slideData[cur]?.h || [];

  const stageClasses = [
    'stage',
    driving ? 'driving' : '',
    rolling ? 'roll' : '',
    cur === 1 ? 's1' : '',
    cur === 3 ? 's2' : '',
    cur === 2 ? 's3' : '',
  ].filter(Boolean).join(' ');

  return (
    <section className={`hx${cur === 0 ? ' on-ex' : ''}`} id="hx" ref={hxRef}>
      <div className="wrap hx-in">
        {/* Giant headline */}
        <h1 className="giant swap" id="giant" ref={giantRef} aria-live="polite" key={`g-${giantKey}`}>
          <span className="g g1" id="gl1">{letters(gLines[0], 0)}</span>
          <span className="g g2" id="gl2">{letters(gLines[1], 1)}</span>
        </h1>

        {/* Route list */}
        <div className="routes" id="routes" ref={routesRef}>
          <h2>{t('kRoutes')}</h2>
          <div className="rlist" role="tablist" aria-label={t('kRoutes')}>
            {ROUTE_KEYS.map((rk, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                className="rbtn"
                aria-selected={i === cur}
                onClick={() => { go(i); play(); }}
              >
                <span className="rt">{t(rk.rt)}</span>
                <span className="rs">{t(rk.rs)}</span>
                <i aria-hidden="true" key={`bar-${cur}-${i}`} />
              </button>
            ))}
          </div>

          {/* Model picker */}
          <div className="models" id="models">
            <span className="mtitle">{t('mdl')}</span>
            <div className="mlist" role="group" aria-label={t('mdl')}>
              {BRANDS.map((brand, i) => (
                <button
                  key={i}
                  type="button"
                  className="mbtn"
                  aria-pressed={i === mdl}
                  onClick={() => pickModel(i)}
                >
                  <img src={`/img/th-${brand.toLowerCase()}.webp`} alt="" width={140} height={93} />
                  <span>
                    <b>{brand}</b>
                    <small>{t('mExc')}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stage with slides */}
        <div
          className={stageClasses}
          id="stage"
          ref={stageRef}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <span className="road" aria-hidden="true" />
          <div className="sparks" ref={sparksRef} aria-hidden="true" />

          {/* Slide 0: Excavators */}
          <div
            className={`slide${cur === 0 ? ' on' : ''}${prev === 0 ? ' out' : ''}${mdl !== 0 ? ' alt' : ''}`}
            style={{ '--dir': SLIDE_DIRS[0] } as React.CSSProperties}
          >
            <div className="vis vis-ex">
              <span className="shadow" aria-hidden="true" />
              {BRANDS.map((brand, i) => (
                <img
                  key={brand}
                  className={`exm${i === mdl ? ' on' : ''}${i === mdl && oldMdl === null && cur === 0 ? ' still' : ''}${i === oldMdl ? ' out' : ''}`}
                  style={{ '--md': MODEL_DIRS[i] } as React.CSSProperties}
                  src={`/img/ex-${brand.toLowerCase()}.webp`}
                  alt={`${brand} excavator`}
                  width={826}
                  height={548}
                  loading={i === 0 ? undefined : 'lazy'}
                />
              ))}
              <span className="mbadge" id="mbadge" aria-live="polite">
                <b>{BRANDS[mdl].toUpperCase()}</b>
              </span>
              {/* Hotspots for slide 0 */}
              {cur === 0 && mdl === 0 && hotspots.map(([x, y, title, text], j) => (
                <HotspotPair key={`hs0-${j}`} x={x} y={y} title={title} text={text} j={j}
                  slideIdx={0} active={activeHs === `0-${j}`}
                  onToggle={(id) => setActiveHs(activeHs === id ? null : id)} />
              ))}
            </div>
          </div>

          {/* Slide 1: Tanker */}
          <div
            className={`slide${cur === 1 ? ' on' : ''}${prev === 1 ? ' out' : ''}`}
            style={{ '--dir': SLIDE_DIRS[1] } as React.CSSProperties}
          >
            <div className="vis vis-tank">
              <span className="shadow" aria-hidden="true" />
              <span className="mbadge kbadge">
                <i className="kdrop" aria-hidden="true" />
                <b>KORTEX</b> OIL
              </span>
              <img src="/img/tanker.webp" alt="Fuel tanker truck" width={1073} height={410} />
              {cur === 1 && slideData[1]?.h.map(([x, y, title, text], j) => (
                <HotspotPair key={`hs1-${j}`} x={x} y={y} title={title} text={text} j={j}
                  slideIdx={1} active={activeHs === `1-${j}`}
                  onToggle={(id) => setActiveHs(activeHs === id ? null : id)} />
              ))}
            </div>
          </div>

          {/* Slide 2: Ship */}
          <div
            className={`slide${cur === 2 ? ' on' : ''}${prev === 2 ? ' out' : ''}`}
            style={{ '--dir': SLIDE_DIRS[2] } as React.CSSProperties}
          >
            <div className="vis vis-ship">
              <span className="shadow" aria-hidden="true" />
              <span className="mbadge kbadge">
                <b>RT</b> LOGISTICS
              </span>
              <img src="/img/ship.webp" alt="Cargo ship with containers" width={1088} height={550} />
              {cur === 2 && slideData[2]?.h.map(([x, y, title, text], j) => (
                <HotspotPair key={`hs2-${j}`} x={x} y={y} title={title} text={text} j={j}
                  slideIdx={2} active={activeHs === `2-${j}`}
                  onToggle={(id) => setActiveHs(activeHs === id ? null : id)} />
              ))}
            </div>
          </div>

          {/* Slide 3: Truck */}
          <div
            className={`slide${cur === 3 ? ' on' : ''}${prev === 3 ? ' out' : ''}`}
            style={{ '--dir': SLIDE_DIRS[3] } as React.CSSProperties}
          >
            <div className="vis vis-truck">
              <span className="shadow" aria-hidden="true" />
              <img src="/img/truck-hero.webp" alt="Korea flag container truck" width={1059} height={531} />
              {cur === 3 && slideData[3]?.h.map(([x, y, title, text], j) => (
                <HotspotPair key={`hs3-${j}`} x={x} y={y} title={title} text={text} j={j}
                  slideIdx={3} active={activeHs === `3-${j}`}
                  onToggle={(id) => setActiveHs(activeHs === id ? null : id)} />
              ))}
            </div>
          </div>
        </div>

        {/* Hero copy */}
        <div className="hx-copy swap" key={`copy-${copyKey}`}>
          <p className="thin">
            <span>{t('b1')}</span>
            <span>{t('b2')}</span>
            <span>{t('b3')}</span>
          </p>
          <p className="hx-lead" dangerouslySetInnerHTML={{ __html: t('hLead') }} />
          <div className="hx-cta">
            <a className="btn btn-navy" href="#trade">
              <span>{t('hBtn3')}</span>
              <span className="dot" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </span>
            </a>
            <a className="txtlink" href="#companies">{t('hBtn')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HotspotPair({
  x, y, title, text, j, slideIdx, active, onToggle,
}: {
  x: number; y: number; title: string; text: string; j: number;
  slideIdx: number; active: boolean;
  onToggle: (id: string) => void;
}) {
  const id = `${slideIdx}-${j}`;
  const tipId = `tip${slideIdx}_${j}`;
  const isLeft = x > 60;

  return (
    <>
      <button
        type="button"
        className={`hs${active ? ' on' : ''}`}
        style={{ left: x + '%', top: y + '%', '--j': j } as React.CSSProperties}
        aria-describedby={tipId}
        onMouseEnter={() => onToggle(id)}
        onFocus={() => onToggle(id)}
        onClick={() => onToggle(id)}
        onMouseLeave={() => onToggle(id)}
        onBlur={() => onToggle(id)}
      >
        <span>{j + 1}</span>
      </button>
      <div
        className={`tip${isLeft ? ' tip-l' : ''}${active ? ' show' : ''}`}
        id={tipId}
        role="tooltip"
        style={{ left: x + '%', top: y + '%' }}
      >
        <b>{title}</b>
        <span>{text}</span>
      </div>
    </>
  );
}
