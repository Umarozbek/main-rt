'use client';

import { useEffect } from 'react';

export function useScrollEffects() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

    const $$ = (s: string, r?: Element | Document) =>
      Array.prototype.slice.call((r || document).querySelectorAll(s)) as HTMLElement[];

    // ===== Reveal + counters =====
    function count(c: HTMLElement) {
      const to = +(c.dataset.to || 0);
      const st = performance.now();
      (function step(now: number) {
        const p = Math.min(1, (now - st) / 1100);
        c.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      })(st);
    }

    let rvIo: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window && !reduce) {
      rvIo = new IntersectionObserver(
        (es) => {
          es.forEach((en) => {
            if (!en.isIntersecting) return;
            (en.target as HTMLElement).classList.add('in');
            $$('.count', en.target).forEach(count);
            rvIo!.unobserve(en.target);
          });
        },
        { threshold: 0.15 },
      );
      $$('.rv').forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight * 0.9) {
          el.classList.add('in');
          return;
        }
        rvIo!.observe(el);
      });
    } else {
      const route = document.getElementById('route');
      if (route) route.classList.add('in');
    }

    // ===== Mega text fill + header solid =====
    const mega = document.getElementById('mega');
    function onScroll() {
      if (mega) {
        const m = mega.getBoundingClientRect();
        const mp = Math.min(1, Math.max(0, (innerHeight - m.top) / (m.height + 200)));
        mega.style.setProperty('--fill', (mp * 100).toFixed(1) + '%');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== Timeline fill =====
    const tlEl = document.getElementById('tl');
    const tlFill = document.getElementById('tlFill');
    const tlItems = $$('.tl-item');
    function tlUpdate() {
      if (!tlEl || !tlFill) return;
      const r = tlEl.getBoundingClientRect();
      const mid = innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      tlFill.style.setProperty('--tl', (p * 100).toFixed(1) + '%');
      tlFill.style.height = (p * 100) + '%';
      tlItems.forEach((it) => {
        const ir = it.getBoundingClientRect();
        it.classList.toggle('done', ir.top + 28 < mid);
      });
    }
    window.addEventListener('scroll', tlUpdate, { passive: true });
    tlUpdate();

    // ===== FAB =====
    const fabEl = document.getElementById('fab');
    function fabUpd() {
      if (fabEl) fabEl.classList.toggle('show', scrollY > innerHeight * 0.6);
    }
    window.addEventListener('scroll', fabUpd, { passive: true });
    fabUpd();

    // ===== Motion band scroll velocity =====
    const b1 = document.getElementById('band1');
    const b2 = document.getElementById('band2');
    let bandOff = 0, bandLastY = scrollY, bandVel = 0;
    let bandRaf: number;
    function bandLoop() {
      if (reduce) return;
      const dy = scrollY - bandLastY;
      bandLastY = scrollY;
      bandVel += (Math.abs(dy) * 0.35 - bandVel) * 0.08;
      bandOff += 0.6 + bandVel;
      if (b1 && b2) {
        const w = b1.scrollWidth / 2 || 1;
        const o = bandOff % w;
        b1.style.transform = 'translateX(' + (-o) + 'px)';
        b2.style.transform = 'translateX(' + (o - w) + 'px)';
      }
      bandRaf = requestAnimationFrame(bandLoop);
    }
    if (!reduce) bandRaf = requestAnimationFrame(bandLoop);

    // ===== Split headings (word by word reveal) =====
    function splitHeads() {
      $$('.head h2').forEach((h) => {
        const t = h.textContent?.trim() || '';
        h.innerHTML = t
          .split(/\s+/)
          .map((w, i) => `<span class="wd" style="--w:${i}"><span>${w}</span></span>`)
          .join(' ');
      });
    }
    splitHeads();

    // ===== Wipe + split observe =====
    let wipeIo: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window && !reduce) {
      wipeIo = new IntersectionObserver(
        (es) => {
          es.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target as HTMLElement;
            if (el.classList.contains('wipe-ready')) el.classList.remove('wipe-ready');
            if (el.classList.contains('split-ready')) el.classList.add('in');
            wipeIo!.unobserve(el);
          });
        },
        { threshold: 0.2 },
      );
      $$('.wipe').forEach((el) => {
        if (el.getBoundingClientRect().top > innerHeight) {
          el.classList.add('wipe-ready');
          wipeIo!.observe(el);
        }
      });
      $$('.head h2').forEach((h) => {
        if (h.getBoundingClientRect().top > innerHeight) {
          h.classList.add('split-ready');
          wipeIo!.observe(h);
        }
      });
    }

    // ===== World map route animation =====
    const route = document.getElementById('route');
    const lits = $$('#route .lit');
    const mg = document.getElementById('movers');
    const mvs: { p: SVGPathElement; L: number; c: SVGCircleElement; o: number; sp: number }[] = [];
    let worldRaf: number;
    const NS = 'http://www.w3.org/2000/svg';

    if (route && mg) {
      lits.forEach((pth, i) => {
        const p = pth as unknown as SVGPathElement;
        const L = p.getTotalLength();
        p.style.setProperty('--len', String(Math.ceil(L)));
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('r', '5');
        c.setAttribute('class', 'mv');
        mg.appendChild(c);
        mvs.push({ p, L, c, o: i * 0.37, sp: 3800 + i * 420 });
      });

      const wt0 = performance.now();
      const moveDots = (now: number) => {
        mvs.forEach((m) => {
          const f = (((now - wt0) / m.sp) + m.o) % 1;
          const pt = m.p.getPointAtLength(f * m.L);
          m.c.setAttribute('cx', String(pt.x));
          m.c.setAttribute('cy', String(pt.y));
          m.c.setAttribute('opacity', String(f < 0.08 ? f / 0.08 : f > 0.92 ? (1 - f) / 0.08 : 1));
        });
        if (!reduce) worldRaf = requestAnimationFrame(moveDots);
      }

      if (reduce) {
        mvs.forEach((m) => {
          const pt = m.p.getPointAtLength(m.L * 0.5);
          m.c.setAttribute('cx', String(pt.x));
          m.c.setAttribute('cy', String(pt.y));
        });
        lits.forEach((p) => { (p as HTMLElement).style.strokeDashoffset = '0'; });
      } else {
        worldRaf = requestAnimationFrame(moveDots);
      }

      // Comets, rings, highlight cycle
      if (!reduce) {
        const svgEl = route.querySelector('svg');
        const dsts = $$('#route .dst');
        const labels = $$('#route .city:not(.hubl)');
        const rings: SVGCircleElement[] = [];

        if (svgEl) {
          lits.forEach((pth, i) => {
            const p = pth as unknown as SVGPathElement;
            const L = p.getTotalLength();
            const c = document.createElementNS(NS, 'path');
            c.setAttribute('d', p.getAttribute('d') || '');
            c.setAttribute('class', 'comet');
            c.style.setProperty('--lenpx', Math.ceil(L) + 'px');
            c.style.setProperty('--cd', (2.4 + L / 400).toFixed(2) + 's');
            c.style.setProperty('--cdl', (i * 0.35) + 's');
            svgEl.insertBefore(c, mg);
          });
        }

        dsts.forEach((d) => {
          const r = document.createElementNS(NS, 'circle');
          r.setAttribute('class', 'ring');
          r.setAttribute('cx', d.getAttribute('cx') || '0');
          r.setAttribute('cy', d.getAttribute('cy') || '0');
          r.setAttribute('r', '6');
          d.parentNode!.insertBefore(r, d);
          rings.push(r);
        });

        let hi = -1;
        const cycle = () => {
          const r = route!.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) return;
          route!.classList.add('cycling');
          hi = (hi + 1) % lits.length;
          lits.forEach((l, i) => l.classList.toggle('hot', i === hi));
          labels.forEach((l, i) => l.classList.toggle('hot', i === hi));
          const rg = rings[hi];
          if (rg) { rg.classList.remove('ping'); void rg.getBoundingClientRect(); rg.classList.add('ping'); }
        }
        const cycleTimeout = setTimeout(() => { cycle(); }, 2400);
        const cycleInterval = setInterval(cycle, 1600);
        // Store for cleanup
        (window as unknown as Record<string, unknown>).__worldCleanup = () => {
          clearTimeout(cycleTimeout);
          clearInterval(cycleInterval);
        };
      }
    }

    // ===== Scroll parallax on photos =====
    const pxEls = $$('.about-img img,.cargo-poster img,.news-img img,.ph-img img');
    function parallax() {
      pxEls.forEach((im) => {
        const r = im.parentElement!.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        im.style.transform = 'translateY(' + (k * -36) + 'px) scale(1.12)';
      });
    }
    if (!reduce) {
      window.addEventListener('scroll', parallax, { passive: true });
      parallax();
    }

    // ===== Custom cursor =====
    let curDot: HTMLElement | null = null;
    let ring: HTMLElement | null = null;
    let cursorRaf: number;
    if (fine && !reduce) {
      curDot = document.createElement('div');
      curDot.className = 'cursor';
      curDot.id = 'cur';
      curDot.setAttribute('aria-hidden', 'true');
      ring = document.createElement('div');
      ring.className = 'cursor-ring';
      ring.id = 'curR';
      ring.setAttribute('aria-hidden', 'true');
      document.body.appendChild(curDot);
      document.body.appendChild(ring);

      let mx = 0, my = 0, rx = 0, ry = 0;
      const onPointerMove = (e: PointerEvent) => {
        mx = e.clientX;
        my = e.clientY;
        document.body.classList.add('cursor-on');
        curDot!.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      };
      const onPointerLeave = () => {
        document.body.classList.remove('cursor-on');
      };
      const onPointerOver = (e: PointerEvent) => {
        ring!.classList.toggle('big', !!(e.target as HTMLElement).closest('a,button,.hs,.co,.tcard,.app'));
      };
      window.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerleave', onPointerLeave);
      document.addEventListener('pointerover', onPointerOver as EventListener);

      (function loop() {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        ring!.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        cursorRaf = requestAnimationFrame(loop);
      })();
    }

    // ===== Magnetic buttons =====
    if (fine && !reduce) {
      $$('.btn').forEach((b) => {
        const onMove = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.18) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3) + 'px)';
        };
        const onLeave = () => { b.style.transform = ''; };
        b.addEventListener('pointermove', onMove as EventListener);
        b.addEventListener('pointerleave', onLeave);
      });
    }

    // ===== 3D tilt cards =====
    if (fine && !reduce) {
      $$('.co,.tcard,.app,.pillar,.num,.fl').forEach((c) => {
        c.classList.add('tilt');
        const onMove = (e: PointerEvent) => {
          const r = c.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          c.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-6px)';
        };
        const onLeave = () => { c.style.transform = ''; };
        c.addEventListener('pointermove', onMove as EventListener);
        c.addEventListener('pointerleave', onLeave);
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', tlUpdate);
      window.removeEventListener('scroll', fabUpd);
      window.removeEventListener('scroll', parallax);
      if (rvIo) rvIo.disconnect();
      if (wipeIo) wipeIo.disconnect();
      if (bandRaf) cancelAnimationFrame(bandRaf);
      if (cursorRaf!) cancelAnimationFrame(cursorRaf);
      if (worldRaf) cancelAnimationFrame(worldRaf);
      if (curDot) curDot.remove();
      if (ring) ring.remove();
      document.body.classList.remove('cursor-on');
      const wc = (window as unknown as Record<string, unknown>).__worldCleanup;
      if (typeof wc === 'function') wc();
    };
  }, []);
}
