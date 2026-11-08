'use client'

import { useState, useCallback, useRef, useEffect, FormEvent } from 'react'
import { useLang } from '../lib/i18n'
import type { Lang } from '../lib/types'

const ARROW = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M8 7h9v9"/></svg>
const IG = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>

const BRANDS = ['rt-logo.png','dream.jpg','rtmotors.png','medline.jpg','akataxi.jpg','ic-ship.webp']
const BAND_WORDS = ['IMPORT','EKSPORT','LOGISTIKA','MOBILLIK']

const LAND_D = "M132.8 3.7h0M140.0 3.7h0M147.2 3.7h0M197.8 3.7h0M212.2 3.7h0M320.6 3.7h0M327.8 3.7h0M335.0 3.7h0M342.2 3.7h0M349.4 3.7h0M356.7 3.7h0M363.9 3.7h0M371.1 3.7h0M378.3 3.7h0M385.6 3.7h0M392.8 3.7h0M400.0 3.7h0M407.2 3.7h0M623.9 3.7h0M631.1 3.7h0M717.8 3.7h0M725.0 3.7h0M732.2 3.7h0M739.4 3.7h0M746.7 3.7h0M753.9 3.7h0M761.1 3.7h0M768.3 3.7h0M862.2 3.7h0M132.8 13.2h0M154.4 13.2h0M161.7 13.2h0M168.9 13.2h0M176.1 13.2h0M197.8 13.2h0M212.2 13.2h0M226.7 13.2h0M233.9 13.2h0M241.1 13.2h0M248.3 13.2h0M255.6 13.2h0M262.8 13.2h0M270.0 13.2h0M320.6 13.2h0M327.8 13.2h0M335.0 13.2h0M342.2 13.2h0M349.4 13.2h0M356.7 13.2h0M363.9 13.2h0M371.1 13.2h0M378.3 13.2h0M385.6 13.2h0M392.8 13.2h0M400.0 13.2h0M407.2 13.2h0M623.9 13.2h0M660.0 13.2h0M667.2 13.2h0M688.9 13.2h0M696.1 13.2h0M710.6 13.2h0M717.8 13.2h0M725.0 13.2h0M732.2 13.2h0M739.4 13.2h0M746.7 13.2h0M753.9 13.2h0M761.1 13.2h0M768.3 13.2h0M775.6 13.2h0M782.8 13.2h0M790.0 13.2h0M797.2 13.2h0M804.4 13.2h0M811.7 13.2h0M818.9 13.2h0M826.1 13.2h0M840.6 13.2h0M847.8 13.2h0M862.2 13.2h0M869.4 13.2h0M876.7 13.2h0M883.9 13.2h0M891.1 13.2h0M977.8 13.2h0"

const ARCS: [string,string][] = [
  ["M825.0 137.5 Q744.7 78.5 664.4 123.6","0.00s"],
  ["M825.0 137.5 Q700.9 -1.6 576.7 70.4","0.18s"],
  ["M825.0 137.5 Q725.4 80.3 625.8 182.2","0.36s"],
  ["M825.0 137.5 Q688.9 48.4 552.8 124.7","0.54s"],
  ["M825.0 137.5 Q662.5 -4.0 500.0 88.0","0.72s"],
  ["M825.0 137.5 Q516.6 -37.0 208.3 135.7","0.90s"],
  ["M825.0 137.5 Q795.9 110.1 766.7 216.3","1.08s"],
]
const DST: [number,number][] = [[664.4,123.6],[576.7,70.4],[625.8,182.2],[552.8,124.7],[500.0,88.0],[208.3,135.7],[766.7,216.3]]

export default function ClientPage() {
  const { lang, setLang, t } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const [specOpen, setSpecOpen] = useState(false)
  const [specModel, setSpecModel] = useState('')
  const [specSlide, setSpecSlide] = useState(0)
  const [expandedCo, setExpandedCo] = useState<string|null>(null)
  const specRef = useRef<HTMLDialogElement>(null)
  const [formNote, setFormNote] = useState('')

  const toggleMenu = useCallback(() => {
    setMenuOpen(o => {
      document.body.classList.toggle('menu-open', !o)
      return !o
    })
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    document.body.classList.remove('menu-open')
  }, [])

  const openSpec = useCallback((model: string) => {
    setSpecModel(model)
    setSpecSlide(0)
    setSpecOpen(true)
    specRef.current?.showModal()
  }, [])

  const closeSpec = useCallback(() => {
    setSpecOpen(false)
    specRef.current?.close()
  }, [])

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = (form.querySelector('#f-name') as HTMLInputElement).value.trim()
    const phone = (form.querySelector('#f-phone') as HTMLInputElement).value.trim()
    if (!name || !phone) {
      setFormNote(t('errReq') || 'Iltimos, ism va telefon raqamini kiriting.')
      return
    }
    setFormNote(t('okDemo') || 'Demo rejim — xabar yuborilmadi.')
  }, [t])

  // Scroll effects
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    // Header solid on scroll
    const hdr = document.getElementById('hdr')
    const fab = document.getElementById('fab')
    const mega = document.getElementById('mega') as HTMLElement | null
    const tlFill = document.getElementById('tlFill') as HTMLElement | null
    const tl = document.getElementById('tl')

    // Reveal observer
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target) }
      })
    }, { threshold: 0.15 })
    document.querySelectorAll('.rv').forEach(el => revealObs.observe(el))

    // Pillar observer
    const pillarObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); pillarObs.unobserve(e.target) }
      })
    }, { threshold: 0.3 })
    document.querySelectorAll('.pillar').forEach(el => pillarObs.observe(el))

    // Fleet drive-in observer
    const fleetObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.remove('pre'), 200)
          fleetObs.unobserve(e.target)
        }
      })
    }, { threshold: 0.2 })
    document.querySelectorAll('.fl').forEach(el => { el.classList.add('pre'); fleetObs.observe(el) })

    // World map route draw-in
    const routeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); routeObs.unobserve(e.target) }
      })
    }, { threshold: 0.2 })
    const routeEl = document.getElementById('route')
    if (routeEl) routeObs.observe(routeEl)

    // Wipe observer
    const wipeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('wipe-ready')
          setTimeout(() => e.target.classList.remove('wipe-ready'), 50)
          wipeObs.unobserve(e.target)
        }
      })
    }, { threshold: 0.25 })
    document.querySelectorAll('.wipe').forEach(el => wipeObs.observe(el))

    // Counter animation
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        const to = parseInt(el.dataset.to || '0')
        let start = 0
        const dur = 1600
        const t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          el.textContent = String(Math.round(start + (to - start) * ease))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        counterObs.unobserve(el)
      })
    }, { threshold: 0.5 })
    document.querySelectorAll('.count').forEach(el => counterObs.observe(el))

    // Scroll handler
    const onScroll = () => {
      const sy = window.scrollY
      // Header solid
      if (hdr) hdr.classList.toggle('solid', sy > 20)
      // FAB show
      if (fab) fab.classList.toggle('show', sy > window.innerHeight * 0.6)
      // Footer mega fill
      if (mega) {
        const r = mega.getBoundingClientRect()
        const pct = Math.min(100, Math.max(0, (window.innerHeight - r.top) / r.height * 100))
        mega.style.setProperty('--fill', pct + '%')
      }
      // Timeline fill
      if (tl && tlFill) {
        const items = tl.querySelectorAll('.tl-item')
        const tlRect = tl.getBoundingClientRect()
        const mid = window.innerHeight * 0.6
        const pct = Math.min(100, Math.max(0, (mid - tlRect.top) / (tlRect.height) * 100))
        tlFill.style.height = pct + '%'
        items.forEach(it => {
          const r = it.getBoundingClientRect()
          it.classList.toggle('done', r.top < mid)
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Band motion with scroll velocity
    let lastSy = window.scrollY
    let velocity = 0
    const band1 = document.getElementById('band1') as HTMLElement | null
    const band2 = document.getElementById('band2') as HTMLElement | null
    let bandX1 = 0, bandX2 = 0
    let bandRaf: number
    const bandTick = () => {
      const sy = window.scrollY
      velocity = velocity * 0.92 + (sy - lastSy) * 0.08
      lastSy = sy
      const speed = 0.5 + Math.abs(velocity) * 0.3
      bandX1 -= speed
      bandX2 += speed
      if (band1) band1.style.transform = `translateX(${bandX1 % (band1.scrollWidth / 2)}px)`
      if (band2) band2.style.transform = `translateX(${bandX2 % ((band2?.scrollWidth || 1) / 2)}px)`
      bandRaf = requestAnimationFrame(bandTick)
    }
    bandRaf = requestAnimationFrame(bandTick)

    // Hero slider
    const slides = document.querySelectorAll<HTMLElement>('.slide')
    const rbtns = document.querySelectorAll<HTMLElement>('.rbtn')
    const hxEl = document.getElementById('hx')
    const giantEl = document.getElementById('giant')
    const exModels = ['Volvo','Hyundai','Doosan']
    let curSlide = 0, curModel = 0, tickCount = 0
    const heroDir = [1, 1, 1, -1]

    function setSlide(s: number) {
      slides.forEach((sl, i) => {
        sl.classList.remove('on','out')
        if (i === s) sl.classList.add('on')
        else if (i === curSlide) sl.classList.add('out')
      })
      rbtns.forEach((b, i) => {
        b.setAttribute('aria-selected', i === s ? 'true' : 'false')
      })
      if (hxEl) {
        hxEl.className = `hx${s === 0 ? ' on-ex' : ''}`
      }
      // Update giant headline from hero data
      const gl1 = document.getElementById('gl1')
      const gl2 = document.getElementById('gl2')
      const heroSlideData = [
        [t('r1'), t('r1s')],
        [t('r2'), t('r2s')],
        [t('r3'), t('r3s')],
        [t('r4'), t('r4s')],
      ]
      if (gl1 && gl2 && heroSlideData[s]) {
        gl1.textContent = heroSlideData[s][0]
        gl2.textContent = heroSlideData[s][1]
        if (giantEl) { giantEl.classList.remove('swap'); void giantEl.offsetWidth; giantEl.classList.add('swap') }
      }
      curSlide = s
      tickCount = 0
    }

    // Route buttons click
    rbtns.forEach((b, i) => {
      b.addEventListener('click', () => setSlide(i))
    })

    // Model picker
    const mbtns = document.querySelectorAll<HTMLElement>('.mbtn')
    const exImgs = document.querySelectorAll<HTMLElement>('.exm')
    const mbadge = document.getElementById('mbadge')
    function setModel(m: number) {
      exImgs.forEach((img, i) => {
        img.classList.remove('on','out','still')
        if (i === m) img.classList.add('on','still')
      })
      mbtns.forEach((b, i) => b.setAttribute('aria-pressed', i === m ? 'true' : 'false'))
      if (mbadge) mbadge.innerHTML = `<b>${exModels[m]}</b>`
      curModel = m
    }
    mbtns.forEach((b, i) => b.addEventListener('click', () => setModel(i)))

    // Auto advance
    const heroTimer = setInterval(() => {
      if (curSlide === 0) {
        tickCount++
        if (tickCount >= 3) {
          const nextM = (curModel + 1) % 3
          if (nextM === 0) setSlide(1)
          else setModel(nextM)
        }
      } else {
        tickCount++
        if (tickCount >= 2) setSlide((curSlide + 1) % 4)
      }
    }, 3000)

    // Section title word split reveal
    document.querySelectorAll('.head h2').forEach(h2 => {
      const text = h2.textContent || ''
      const words = text.split(/\s+/)
      h2.innerHTML = words.map((w, i) => `<span class="wd" style="--w:${i}"><span>${w}</span></span>`).join(' ')
      h2.classList.add('split-ready')
    })

    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches
    const cleanups: (() => void)[] = []

    // Custom cursor
    if (fine && !reduce) {
      const curDot = document.getElementById('cur') as HTMLElement
      const ring = document.getElementById('curR') as HTMLElement
      let mx = 0, my = 0, rx = 0, ry = 0
      const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; document.body.classList.add('cursor-on'); curDot.style.transform = `translate(${mx}px,${my}px)` }
      const onLeave = () => document.body.classList.remove('cursor-on')
      const onOver = (e: PointerEvent) => { ring.classList.toggle('big', !!(e.target as Element)?.closest('a,button,.hs,.co,.tcard,.app')) }
      let curRaf: number
      const curLoop = () => { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; ring.style.transform = `translate(${rx}px,${ry}px)`; curRaf = requestAnimationFrame(curLoop) }
      curRaf = requestAnimationFrame(curLoop)
      addEventListener('pointermove', onMove)
      document.addEventListener('pointerleave', onLeave)
      document.addEventListener('pointerover', onOver as EventListener)
      cleanups.push(() => { removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave); document.removeEventListener('pointerover', onOver as EventListener); cancelAnimationFrame(curRaf) })
    }

    // Magnetic buttons
    if (fine && !reduce) {
      document.querySelectorAll<HTMLElement>('.btn').forEach(b => {
        const mm = (e: PointerEvent) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)` }
        const ml = () => { b.style.transform = '' }
        b.addEventListener('pointermove', mm as EventListener)
        b.addEventListener('pointerleave', ml)
      })
    }

    // 3D tilt cards
    if (fine && !reduce) {
      document.querySelectorAll<HTMLElement>('.co,.tcard,.app,.pillar,.num,.fl').forEach(c => {
        c.classList.add('tilt')
        const tm = (e: PointerEvent) => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5; c.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)` }
        const tl = () => { c.style.transform = '' }
        c.addEventListener('pointermove', tm as EventListener)
        c.addEventListener('pointerleave', tl)
      })
    }

    // Giant headline font fitting
    const fitGiant = () => {
      const g = document.getElementById('giant') as HTMLElement
      if (!g) return
      if (innerWidth < 901) { g.style.removeProperty('--gfs'); return }
      const ro = document.getElementById('routes')?.getBoundingClientRect()
      const gl = g.getBoundingClientRect().left
      if (!ro) return
      const avail = ro.left - gl - 24
      g.style.setProperty('--gfs', '200px')
      const gl1 = document.getElementById('gl1')
      const gl2 = document.getElementById('gl2')
      const w = Math.max(gl1?.scrollWidth || 1, gl2?.scrollWidth || 1) || 1
      const size = Math.max(70, Math.min(140, 200 * avail / w * 0.78, (innerHeight - 200) * 0.3))
      g.style.setProperty('--gfs', size.toFixed(1) + 'px')
    }
    const onResize = () => fitGiant()
    addEventListener('resize', onResize)
    if (document.fonts?.ready) document.fonts.ready.then(fitGiant)
    fitGiant()
    cleanups.push(() => removeEventListener('resize', onResize))

    // Hero scroll exit + mouse parallax
    const stEl = document.getElementById('stage') as HTMLElement
    const giEl = document.getElementById('giant') as HTMLElement
    const roEl = document.getElementById('routes') as HTMLElement
    const leaderEl = document.getElementById('leader') as HTMLElement
    let pmx = 0, pmy = 0, heroP = 0
    const wideHero = matchMedia('(min-width:901px)')
    const applyHero = () => {
      if (!stEl || !giEl || !roEl) return
      const p = heroP, e = p * p * (3 - 2 * p)
      const fade = Math.max(0, 1 - Math.max(0, (p - 0.45) / 0.5))
      stEl.style.transform = `translate(${pmx * 22 + e * 120}px,${pmy * 12 - e * innerHeight * 0.75}px) rotate(${-e * 9}deg) scale(${1 - e * 0.32})`
      stEl.style.opacity = String(fade)
      giEl.style.transform = `translate(${-pmx * 26 - e * 60}px,${-pmy * 14 + e * 140}px)`
      giEl.style.opacity = String(Math.max(0, 1 - p * 1.3))
      roEl.style.transform = `translate(${pmx * 10}px,${pmy * 6 - e * 80}px)`
      roEl.style.opacity = String(Math.max(0, 1 - p * 2))
      if (leaderEl) leaderEl.style.opacity = String(Math.max(0, 1 - p * 2.5))
    }
    if (fine && !reduce && hxEl) {
      const hxMove = (e: PointerEvent) => { const r = (hxEl as HTMLElement).getBoundingClientRect(); pmx = (e.clientX - r.left) / r.width - 0.5; pmy = (e.clientY - r.top) / r.height - 0.5; applyHero() }
      hxEl.addEventListener('pointermove', hxMove as EventListener)
    }
    if (!reduce) {
      let heroTick = false
      const heroScroll = () => { if (heroTick) return; heroTick = true; requestAnimationFrame(() => { heroTick = false; const h = (hxEl as HTMLElement)?.offsetHeight || 1; heroP = wideHero.matches ? Math.min(1, Math.max(0, scrollY / (h * 0.8))) : 0; applyHero() }) }
      addEventListener('scroll', heroScroll, { passive: true })
      cleanups.push(() => removeEventListener('scroll', heroScroll))
    }

    // Smoke & dust particles
    const EXH: Record<number, number[][]> = { 0: [], 1: [[29, 2]], 2: [[78, 4]], 3: [[53, 1], [71, 3]] }
    const WAKE: Record<number, number[][]> = { 2: [[7, 86], [12, 90]] }
    const TIRE: Record<number, number[][]> = { 0: [[45, 97], [70, 97], [92, 97]], 1: [[22, 95], [57, 95], [88, 95]], 3: [[9, 94], [39, 94], [70, 94]] }
    const emit = (i: number, heavy: boolean) => {
      const sl = slides[i]; if (!sl) return
      const vis = sl.querySelector('.vis') as HTMLElement; if (!vis) return
      const dir = parseFloat(getComputedStyle(sl).getPropertyValue('--dir')) || 1
      ;(EXH[i] || []).forEach(pt => {
        const d = document.createElement('i'); d.className = 'smoke' + (heavy ? '' : ' light')
        d.style.left = pt[0] + '%'; d.style.top = pt[1] + '%'
        d.style.setProperty('--sx', (dir * (heavy ? 90 + Math.random() * 140 : 20 + Math.random() * 50)) + 'px')
        d.style.setProperty('--sy', (-(heavy ? 50 : 70) - Math.random() * 90) + 'px')
        d.style.setProperty('--sc', (heavy ? 4 + Math.random() * 3 : 2.5 + Math.random() * 2.5).toFixed(2))
        d.style.setProperty('--t', (heavy ? 1.8 : 2.8) + 's')
        vis.appendChild(d); setTimeout(() => d.remove(), 3000)
      })
      ;(WAKE[i] || []).forEach(pt => {
        if (!heavy && Math.random() < 0.5) return
        const w = document.createElement('i'); w.className = 'smoke wake'
        w.style.left = pt[0] + '%'; w.style.top = pt[1] + '%'
        w.style.setProperty('--sx', (dir * (40 + Math.random() * 80)) + 'px')
        w.style.setProperty('--sy', (Math.random() * 16 - 4) + 'px')
        w.style.setProperty('--sc', (2 + Math.random() * 2).toFixed(2))
        w.style.setProperty('--t', '1.6s')
        vis.appendChild(w); setTimeout(() => w.remove(), 1800)
      })
    }
    const tireDust = (i: number, strength: number) => {
      const sl = slides[i]; if (!sl) return
      const vis = sl.querySelector('.vis') as HTMLElement; if (!vis) return
      const dir = parseFloat(getComputedStyle(sl).getPropertyValue('--dir')) || 1
      ;(TIRE[i] || []).forEach(pt => {
        for (let k = 0; k < strength; k++) {
          const d = document.createElement('i'); d.className = 'smoke tire'
          d.style.left = (pt[0] + (Math.random() * 4 - 2)) + '%'; d.style.top = pt[1] + '%'
          d.style.setProperty('--sx', (dir * (60 + Math.random() * 150)) + 'px')
          d.style.setProperty('--sy', (-8 - Math.random() * 45) + 'px')
          d.style.setProperty('--sc', (3 + Math.random() * 3.5).toFixed(2))
          d.style.setProperty('--t', (1.2 + Math.random() * 0.8).toFixed(2) + 's')
          vis.appendChild(d); setTimeout(() => d.remove(), 2200)
        }
      })
    }
    let lastOutSlide: number | null = null
    let smokeIv: ReturnType<typeof setInterval> | undefined
    if (!reduce) {
      smokeIv = setInterval(() => {
        if (document.hidden) return
        const r = (hxEl as HTMLElement)?.getBoundingClientRect(); if (!r || r.bottom < 0) return
        emit(curSlide, false)
      }, 140)
    }
    cleanups.push(() => { if (smokeIv) clearInterval(smokeIv) })

    // Brake dust on slide change
    const sp = document.getElementById('sparks') as HTMLElement
    const spawnDust = () => {
      if (reduce || !sp) return
      sp.innerHTML = ''
      setTimeout(() => {
        for (let k = 0; k < 14; k++) {
          const d = document.createElement('i'); d.className = 'dust'
          const left = Math.random() < 0.5
          d.style.left = (left ? 20 + Math.random() * 25 : 55 + Math.random() * 25) + '%'
          d.style.setProperty('--dx', ((left ? -1 : 1) * (40 + Math.random() * 120)) + 'px')
          d.style.setProperty('--dy', (-10 - Math.random() * 50) + 'px')
          d.style.setProperty('--sc', (2 + Math.random() * 3).toFixed(2))
          d.style.animationDelay = (Math.random() * 0.15) + 's'
          sp.appendChild(d)
        }
      }, 1250)
    }
    spawnDust()

    // Hero swipe on mobile
    let tx: number | null = null, ty: number | null = null
    const onTouchStart = (e: TouchEvent) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY }
    const onTouchEnd = (e: TouchEvent) => {
      if (tx === null) return
      const dx = e.changedTouches[0].clientX - tx!, dy = e.changedTouches[0].clientY - ty!
      tx = null
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) setSlide((curSlide + (dx < 0 ? 1 : 3)) % 4)
    }
    if (stEl) {
      stEl.addEventListener('touchstart', onTouchStart, { passive: true })
      stEl.addEventListener('touchend', onTouchEnd, { passive: true })
    }

    // Fleet dust on drive-in
    const flDust = (el: HTMLElement) => {
      if (reduce) return
      const box = el.querySelector('.fl-img') as HTMLElement; if (!box) return
      const dir = parseFloat(el.style.getPropertyValue('--dir')) || 1
      ;[22, 50, 78].forEach(x => {
        for (let k = 0; k < 3; k++) {
          const d = document.createElement('i'); d.className = 'smoke tire'
          d.style.left = (x + Math.random() * 6 - 3) + '%'; d.style.top = '88%'
          d.style.setProperty('--sx', (dir * (30 + Math.random() * 90)) + 'px')
          d.style.setProperty('--sy', (-6 - Math.random() * 30) + 'px')
          d.style.setProperty('--sc', (2.5 + Math.random() * 2.5).toFixed(2))
          d.style.setProperty('--t', (1.1 + Math.random() * 0.7).toFixed(2) + 's')
          box.appendChild(d); setTimeout(() => d.remove(), 2000)
        }
      })
    }
    if (!reduce) {
      const fleetDustObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          const delay = (parseFloat(el.style.getPropertyValue('--d')) * 1000) || 0
          setTimeout(() => { el.classList.remove('pre'); setTimeout(() => flDust(el), 900) }, delay)
          fleetDustObs.unobserve(el)
        })
      }, { threshold: 0.3 })
      document.querySelectorAll('.fl').forEach(el => {
        if (el.getBoundingClientRect().top > innerHeight) { (el as HTMLElement).classList.add('pre'); fleetDustObs.observe(el) }
      })
      cleanups.push(() => fleetDustObs.disconnect())
    }

    // Fleet "So'rov yuborish" pre-fills form
    document.querySelectorAll<HTMLElement>('.fl-ask').forEach(btn => {
      btn.addEventListener('click', () => {
        const fl = btn.closest('.fl') as HTMLElement
        const sel = document.getElementById('f-co') as HTMLSelectElement
        if (sel) sel.selectedIndex = 1
        const ta = document.getElementById('f-msg') as HTMLTextAreaElement
        if (ta && !ta.value) ta.value = (fl?.dataset.model || '') + ' — '
      })
    })

    // World map route cycling
    let routeCycleIv: ReturnType<typeof setInterval> | undefined
    if (!reduce) {
      const routeEl2 = document.getElementById('route')
      const lits = document.querySelectorAll<HTMLElement>('#route .lit')
      const labels = document.querySelectorAll<HTMLElement>('#route .city:not(.hubl)')
      const dsts = document.querySelectorAll<HTMLElement>('#route .dst')
      const NS = 'http://www.w3.org/2000/svg'
      const svgEl = routeEl2?.querySelector('svg')
      const rings: SVGCircleElement[] = []
      dsts.forEach(d => {
        const r = document.createElementNS(NS, 'circle') as SVGCircleElement
        r.setAttribute('class', 'ring')
        r.setAttribute('cx', d.getAttribute('cx')!)
        r.setAttribute('cy', d.getAttribute('cy')!)
        r.setAttribute('r', '6')
        d.parentNode?.insertBefore(r, d)
        rings.push(r)
      })
      // Comets along arcs
      lits.forEach((pth, i) => {
        try {
          const L = (pth as unknown as SVGPathElement).getTotalLength()
          const c = document.createElementNS(NS, 'path')
          c.setAttribute('d', pth.getAttribute('d')!)
          c.setAttribute('class', 'comet')
          c.style.setProperty('--lenpx', Math.ceil(L) + 'px')
          c.style.setProperty('--cd', (2.4 + L / 400).toFixed(2) + 's')
          c.style.setProperty('--cdl', (i * 0.35) + 's')
          const mg = document.getElementById('movers')
          if (svgEl && mg) svgEl.insertBefore(c, mg)
        } catch { /* path may not support getTotalLength in SSR */ }
      })
      // Moving dots along arcs
      const mvs: { p: SVGPathElement; L: number; c: SVGCircleElement; o: number; sp: number }[] = []
      lits.forEach((pth, i) => {
        try {
          const L = (pth as unknown as SVGPathElement).getTotalLength()
          const c = document.createElementNS(NS, 'circle') as SVGCircleElement
          c.setAttribute('r', '5'); c.setAttribute('class', 'mv')
          document.getElementById('movers')?.appendChild(c)
          mvs.push({ p: pth as unknown as SVGPathElement, L, c, o: i * 0.37, sp: 3800 + i * 420 })
        } catch { /* noop */ }
      })
      const dt0 = performance.now()
      let dotRaf: number
      const moveDots = (now: number) => {
        mvs.forEach(m => {
          const f = (((now - dt0) / m.sp) + m.o) % 1
          try {
            const pt = m.p.getPointAtLength(f * m.L)
            m.c.setAttribute('cx', String(pt.x)); m.c.setAttribute('cy', String(pt.y))
            m.c.setAttribute('opacity', String(f < 0.08 ? f / 0.08 : (f > 0.92 ? (1 - f) / 0.08 : 1)))
          } catch { /* noop */ }
        })
        dotRaf = requestAnimationFrame(moveDots)
      }
      dotRaf = requestAnimationFrame(moveDots)
      cleanups.push(() => cancelAnimationFrame(dotRaf))

      let hi = -1
      const cycle = () => {
        const r = routeEl2?.getBoundingClientRect()
        if (!r || r.bottom < 0 || r.top > innerHeight) return
        routeEl2?.classList.add('cycling')
        hi = (hi + 1) % lits.length
        lits.forEach((l, i) => l.classList.toggle('hot', i === hi))
        labels.forEach((l, i) => l.classList.toggle('hot', i === hi))
        const rg = rings[hi]
        if (rg) { rg.classList.remove('ping'); void rg.getBoundingClientRect(); rg.classList.add('ping') }
      }
      setTimeout(() => { cycle(); routeCycleIv = setInterval(cycle, 1600) }, 2400)
      cleanups.push(() => { if (routeCycleIv) clearInterval(routeCycleIv) })
    }

    // Scroll parallax on photos
    if (!reduce) {
      const pxEls = document.querySelectorAll<HTMLElement>('.about-img img,.cargo-poster img,.news-img img,.ph-img img')
      const parallax = () => {
        pxEls.forEach(im => {
          const r = im.parentElement?.getBoundingClientRect()
          if (!r || r.bottom < 0 || r.top > innerHeight) return
          const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight
          im.style.transform = `translateY(${k * -36}px) scale(1.12)`
        })
      }
      addEventListener('scroll', parallax, { passive: true })
      parallax()
      cleanups.push(() => removeEventListener('scroll', parallax))
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(bandRaf)
      clearInterval(heroTimer)
      revealObs.disconnect()
      pillarObs.disconnect()
      fleetObs.disconnect()
      routeObs.disconnect()
      wipeObs.disconnect()
      counterObs.disconnect()
      cleanups.forEach(fn => fn())
    }
  }, [])

  const langs: Lang[] = ['uz','ru','en']

  const marqTrack = [...BRANDS, ...BRANDS, ...BRANDS].map((src, i) => (
    <img key={i} src={`/img/${src}`} alt="" width="140" height="52" loading="lazy" style={src === 'rtmotors.png' ? { height: 120 } : undefined} />
  ))

  const bandRow = (outline: boolean) => {
    const items = []
    for (let i = 0; i < 8; i++) {
      for (const w of BAND_WORDS) {
        items.push(<span key={`${i}-${w}`}>{w}</span>)
      }
    }
    return <div className={`band-row${outline ? ' o' : ''}`}>{items}</div>
  }

  return (
    <>
      {/* HEADER */}
      <header className={`hdr${menuOpen ? ' solid' : ''}`} id="hdr">
        <div className="wrap hbar">
          <div className="hleft">
            <button className="burger" id="burger" type="button" aria-label="Menyu" aria-expanded={menuOpen} aria-controls="menu" onClick={toggleMenu}>
              <span /><span /><span />
            </button>
            <a className="logo" href="#top">
              <img className="lg-dark" src="/img/rt-logo.png" alt="RT Holdings" width={720} height={296} />
              <img className="lg-light" src="/img/rt-logo-white.png" alt="" aria-hidden="true" width={720} height={296} />
            </a>
          </div>
          <div className="hright">
            <a className="ilink" href="#companies">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
              <span dangerouslySetInnerHTML={{ __html: t('nCos') }} />
            </a>
            <a className="ilink" href="#contact">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>
              <span dangerouslySetInnerHTML={{ __html: t('hLoc') }} />
            </a>
            <a className="ilink" href="#contact">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>
              <span dangerouslySetInnerHTML={{ __html: t('nContact') }} />
            </a>
            <div className="lang" role="group" aria-label="Til">
              {langs.map(l => (
                <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* MENU */}
      <div className="menu" id="menu" hidden={!menuOpen}>
        <div className="wrap menu-in">
          <nav aria-label="Asosiy menyu" className="menu-links">
            <a href="#about" onClick={closeMenu}><small>01</small><span dangerouslySetInnerHTML={{ __html: t('nAbout') }} /></a>
            <a href="#trade" onClick={closeMenu}><small>02</small><span dangerouslySetInnerHTML={{ __html: t('trTitle') }} /></a>
            <a href="#companies" onClick={closeMenu}><small>03</small><span dangerouslySetInnerHTML={{ __html: t('nCos') }} /></a>
            <a href="#cargo" onClick={closeMenu}><small>04</small><span dangerouslySetInnerHTML={{ __html: t('nCargo') }} /></a>
            <a href="#aka" onClick={closeMenu}><small>05</small><span dangerouslySetInnerHTML={{ __html: t('nAka') }} /></a>
            <a href="#news" onClick={closeMenu}><small>06</small><span dangerouslySetInnerHTML={{ __html: t('nNews') }} /></a>
            <a href="#process" onClick={closeMenu}><small>07</small><span dangerouslySetInnerHTML={{ __html: t('pTag') }} /></a>
            <a href="#contact" onClick={closeMenu}><small>08</small><span dangerouslySetInnerHTML={{ __html: t('nContact') }} /></a>
          </nav>
          <p className="menu-tag">Your choice is important 4 us</p>
        </div>
      </div>

      {/* CURSOR */}
      <div className="cursor" id="cur" aria-hidden="true" />
      <div className="cursor-ring" id="curR" aria-hidden="true" />

      <main id="top">
        {/* HERO */}
        <section className="hx on-ex" id="hx">
          <div className="wrap hx-in">
            <h1 className="giant" id="giant" aria-live="polite">
              <span className="g g1" id="gl1" dangerouslySetInnerHTML={{ __html: t('r1') }} />
              <span className="g g2" id="gl2">{t('r1s') || 'Texnika'}</span>
            </h1>

            <div className="routes" id="routes">
              <h2 dangerouslySetInnerHTML={{ __html: t('kRoutes') }} />
              <div className="rlist" role="tablist" aria-label="Yo'nalishlar">
                {[
                  { s: '0', rt: 'r1', rs: 'r1s' },
                  { s: '1', rt: 'r2', rs: 'r2s' },
                  { s: '2', rt: 'r3', rs: 'r3s' },
                  { s: '3', rt: 'r4', rs: 'r4s' },
                ].map((r, i) => (
                  <button key={r.s} type="button" role="tab" className="rbtn" aria-selected={i === 0} data-s={r.s}>
                    <span className="rt" dangerouslySetInnerHTML={{ __html: t(r.rt) }} />
                    <span className="rs" dangerouslySetInnerHTML={{ __html: t(r.rs) }} />
                    <i aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div className="models" id="models">
                <span className="mtitle" dangerouslySetInnerHTML={{ __html: t('mdl') }} />
                <div className="mlist" role="group" aria-label="Ekskavator modellari">
                  <button type="button" className="mbtn" data-m="0" aria-pressed="true"><img src="/img/th-volvo.webp" alt="" width={140} height={93} /><span><b>Volvo</b><small dangerouslySetInnerHTML={{ __html: t('mExc') }} /></span></button>
                  <button type="button" className="mbtn" data-m="1" aria-pressed="false"><img src="/img/th-hyundai.webp" alt="" width={140} height={95} /><span><b>Hyundai</b><small dangerouslySetInnerHTML={{ __html: t('mExc') }} /></span></button>
                  <button type="button" className="mbtn" data-m="2" aria-pressed="false"><img src="/img/th-doosan.webp" alt="" width={140} height={93} /><span><b>Doosan</b><small dangerouslySetInnerHTML={{ __html: t('mExc') }} /></span></button>
                </div>
              </div>
              <span className="anchor" id="anchor" aria-hidden="true" />
            </div>

            <div className="stage" id="stage">
              <span className="road" aria-hidden="true" /><div className="sparks" id="sparks" aria-hidden="true" />
              <div className="slide on" data-s="0" style={{ ['--dir' as string]: 1 }}>
                <div className="vis vis-ex">
                  <span className="shadow" aria-hidden="true" />
                  <img className="exm on still" style={{ ['--md' as string]: 1 }} src="/img/ex-volvo.webp" alt="Volvo g'ildirakli ekskavatori" width={826} height={548} />
                  <img className="exm" style={{ ['--md' as string]: -1 }} src="/img/ex-hyundai.webp" alt="Hyundai g'ildirakli ekskavatori" width={900} height={611} loading="lazy" />
                  <img className="exm" style={{ ['--md' as string]: 1 }} src="/img/ex-doosan.webp" alt="Doosan g'ildirakli ekskavatori" width={466} height={310} loading="lazy" />
                  <span className="mbadge" id="mbadge" aria-live="polite"><b>VOLVO</b></span>
                </div>
              </div>
              <div className="slide" data-s="1" style={{ ['--dir' as string]: 1 }}>
                <div className="vis vis-tank">
                  <span className="shadow" aria-hidden="true" />
                  <span className="mbadge kbadge"><i className="kdrop" aria-hidden="true" /><b>KORTEX</b> OIL</span>
                  <img src="/img/tanker.webp" alt="Yoqilg'i tankeri" width={1073} height={410} />
                </div>
              </div>
              <div className="slide" data-s="2" style={{ ['--dir' as string]: 1 }}>
                <div className="vis vis-ship">
                  <span className="shadow" aria-hidden="true" />
                  <span className="mbadge kbadge"><b>RT</b> LOGISTICS</span>
                  <img src="/img/ship.webp" alt="Yuk kemasi" width={1088} height={550} />
                </div>
              </div>
              <div className="slide" data-s="3" style={{ ['--dir' as string]: -1 }}>
                <div className="vis vis-truck">
                  <span className="shadow" aria-hidden="true" />
                  <img src="/img/truck-hero.webp" alt="Koreya bayrog'i tushirilgan yuk mashinasi" width={1059} height={531} />
                </div>
              </div>
            </div>

            <div className="hx-copy">
              <p className="thin">
                <span dangerouslySetInnerHTML={{ __html: t('b1') }} />
                <span dangerouslySetInnerHTML={{ __html: t('b2') }} />
                <span dangerouslySetInnerHTML={{ __html: t('b3') }} />
              </p>
              <p className="hx-lead" dangerouslySetInnerHTML={{ __html: t('hLead') }} />
              <div className="hx-cta">
                <a className="btn btn-navy" href="#trade"><span dangerouslySetInnerHTML={{ __html: t('hBtn3') }} /><span className="dot" aria-hidden="true">{ARROW}</span></a>
                <a className="txtlink" href="#companies" dangerouslySetInnerHTML={{ __html: t('hBtn') }} />
              </div>
            </div>

            <svg className="leader" id="leader" aria-hidden="true"><polyline id="lline" points="" /><circle id="ldot1" r="4" /><circle id="ldot2" r="4" /><circle id="ldot3" r="4" /></svg>
          </div>
        </section>

        {/* BRANDS */}
        <section className="brands" aria-label="Brendlar">
          <div className="brands-in">
            <span className="lbl" dangerouslySetInnerHTML={{ __html: t('bLbl') }} />
            <div className="marq"><div className="marq-track" id="marq">{marqTrack}</div></div>
          </div>
        </section>

        {/* MOTION BAND */}
        <section className="band" aria-hidden="true">
          {bandRow(false)}
          {bandRow(true)}
        </section>

        {/* ABOUT */}
        <section className="sec" id="about">
          <div className="wrap">
            <div className="head">
              <div><span className="tag" dangerouslySetInnerHTML={{ __html: t('aTag') }} /><h2 className="rv" dangerouslySetInnerHTML={{ __html: t('aTitle') }} /></div>
            </div>
            <div className="about">
              <div className="about-txt">
                <p className="big rv" dangerouslySetInnerHTML={{ __html: t('aBig') }} />
                <p className="body rv" dangerouslySetInnerHTML={{ __html: t('aBody') }} />
                <div className="pillars">
                  <div className="pillar rv">
                    <div className="ic ic-sea"><span className="waves" aria-hidden="true" /><img className="pl-ship" src="/img/ic-ship.webp" alt="" loading="lazy" /></div>
                    <h3 dangerouslySetInnerHTML={{ __html: t('p1t') }} /><p dangerouslySetInnerHTML={{ __html: t('p1') }} />
                  </div>
                  <div className="pillar rv" style={{ ['--d' as string]: '.12s' }}>
                    <div className="ic ic-road"><span className="road2" aria-hidden="true" /><img className="pl-truck" src="/img/ic-tanker.webp" alt="" loading="lazy" /></div>
                    <h3 dangerouslySetInnerHTML={{ __html: t('p3t') }} /><p dangerouslySetInnerHTML={{ __html: t('p3') }} />
                  </div>
                  <div className="pillar rv" style={{ ['--d' as string]: '.24s' }}>
                    <div className="ic ic-road"><span className="road2" aria-hidden="true" /><img className="pl-ex" src="/img/ic-excavator.webp" alt="" loading="lazy" /></div>
                    <h3 dangerouslySetInnerHTML={{ __html: t('p4t') }} /><p dangerouslySetInnerHTML={{ __html: t('p4') }} />
                  </div>
                </div>
              </div>
              <div className="about-img rv wipe">
                <img src="/img/companies/rt-logistcs-6.jpg" alt="RT Holdings" width={900} height={1200} loading="lazy" />
                <span className="badge" dangerouslySetInnerHTML={{ __html: t('aBadge') }} />
              </div>
            </div>
          </div>
        </section>

        {/* TRADE */}
        <section className="sec" id="trade" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="head">
              <div><span className="tag" dangerouslySetInnerHTML={{ __html: t('trTag') }} /><h2 className="rv" dangerouslySetInnerHTML={{ __html: t('trTitle') }} /></div>
            </div>
            <div className="trade">
              <article className="tcard rv">
                <div className="tvis"><img src="/img/ex-volvo.webp" alt="Volvo ekskavator" width={826} height={548} loading="lazy" /></div>
                <div className="tbody">
                  <span className="cat" dangerouslySetInnerHTML={{ __html: t('r1') }} />
                  <h3 dangerouslySetInnerHTML={{ __html: t('trExH') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('trExP') }} />
                  <p className="ph" dangerouslySetInnerHTML={{ __html: t('trExPh') }} />
                </div>
              </article>
              <article className="tcard rv" style={{ ['--d' as string]: '.1s' }}>
                <div className="tvis photo wipe">
                  <img src="/img/companies/kortex-products.jpg" alt="Kortex Oil" width={1376} height={768} loading="lazy" />
                </div>
                <div className="tbody">
                  <span className="cat" dangerouslySetInnerHTML={{ __html: t('r2') }} />
                  <h3 dangerouslySetInnerHTML={{ __html: t('trImH') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('trImP') }} />
                  <div className="links2"><a href="https://www.instagram.com/kortex_oil/">{IG}Instagram &middot; @kortex_oil</a></div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* FLEET */}
        <section className="sec navy ribbed" id="fleet">
          <div className="wrap">
            <div className="head">
              <div><span className="tag" dangerouslySetInnerHTML={{ __html: t('flTag') }} /><h2 className="rv" dangerouslySetInnerHTML={{ __html: t('flTitle') }} /></div>
            </div>
            <div className="fleet">
              {([
                { brand: 'Volvo', model: 'EW60E Pro', main: 'volvo-main.jpg', thumbs: ['volvo-front','volvo-salon','volvo-ichki','volvo-cabin'], dir: 1, d: '0s', year: '2024', hours: '1 800', extra: '3 ta kovsh' },
                { brand: 'Hyundai', model: 'R140', main: 'hyundai-main.jpg', thumbs: ['hyundai-front','hyundai-motor','hyundai-salon','hyundai-back'], dir: -1, d: '0.1s', year: '2011', hours: '0', extra: 'Aparat motor' },
                { brand: 'Develon', model: 'DX55W-7', main: 'develon-main.jpg', thumbs: ['develon-2','develon-3','develon-4','develon-6'], dir: 1, d: '0.2s', year: '2020', hours: '4 000', extra: '360° adapter' },
              ]).map(fl => (
                <article key={fl.brand} className="fl rv" style={{ ['--dir' as string]: fl.dir, ['--d' as string]: fl.d }} data-model={fl.brand}>
                  <div className="fl-img"><img src={`/img/excavators/${fl.main}`} alt={`${fl.brand} ${fl.model}`} loading="lazy" /></div>
                  <div className="fl-thumbs">
                    {fl.thumbs.map(t2=>(<img key={t2} src={`/img/excavators/${t2}.jpg`} alt="" width={80} height={80} loading="lazy" />))}
                  </div>
                  <div className="fl-body">
                    <h3>{fl.brand} {fl.model}</h3>
                    <p dangerouslySetInnerHTML={{ __html: t('flType') }} />
                    <div className="fl-specs">
                      <span>{fl.year} {lang === 'uz' ? 'yil' : lang === 'ru' ? 'г.' : 'y.'}</span>
                      <span>{fl.hours} {lang === 'uz' ? 'soat' : lang === 'ru' ? 'ч' : 'h'}</span>
                      <span>{fl.extra}</span>
                    </div>
                    <div className="fl-actions">
                      <button type="button" className="fl-spec" onClick={() => openSpec(fl.brand)}><span dangerouslySetInnerHTML={{ __html: t('flSpec') }} /></button>
                      <a className="btn btn-orange fl-ask" href="#contact"><span dangerouslySetInnerHTML={{ __html: t('flAsk') }} /><span className="dot" aria-hidden="true">{ARROW}</span></a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SPEC DIALOG */}
        <dialog className="spec" id="spec" ref={specRef} aria-labelledby="specT">
          <form method="dialog" className="spec-in">
            <button className="spec-x" value="close" aria-label="Yopish" onClick={closeSpec}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
            {(() => {
              const gallery: Record<string,string[]> = {
                Volvo: ['volvo-main','volvo-front','volvo-salon','volvo-ichki','volvo-cabin'],
                Hyundai: ['hyundai-main','hyundai-front','hyundai-motor','hyundai-salon','hyundai-back'],
                Develon: ['develon-main','develon-2','develon-3','develon-4','develon-6'],
              }
              const imgs = gallery[specModel] || []
              return <>
                <div className="spec-gallery" onTouchStart={e => { (e.currentTarget as HTMLElement).dataset.sx = String(e.touches[0].clientX) }}
                  onTouchEnd={e => {
                    const sx = Number((e.currentTarget as HTMLElement).dataset.sx || 0)
                    const dx = e.changedTouches[0].clientX - sx
                    if (Math.abs(dx) > 45) setSpecSlide(s => dx < 0 ? Math.min(s+1, imgs.length-1) : Math.max(s-1, 0))
                  }}>
                  <div className="spec-slides" style={{ transform: `translateX(-${specSlide * 100}%)` }}>
                    {imgs.map(f => <img key={f} src={`/img/excavators/${f}.jpg`} alt={specModel} />)}
                  </div>
                  {imgs.length > 1 && <>
                    <button type="button" className="spec-arr spec-prev" disabled={specSlide === 0} onClick={() => setSpecSlide(s => s - 1)} aria-label="Oldingi">&#8249;</button>
                    <button type="button" className="spec-arr spec-next" disabled={specSlide >= imgs.length - 1} onClick={() => setSpecSlide(s => s + 1)} aria-label="Keyingi">&#8250;</button>
                  </>}
                  <div className="spec-dots">
                    {imgs.map((_,i) => <button key={i} type="button" className={`spec-dot${i===specSlide?' on':''}`} onClick={() => setSpecSlide(i)} aria-label={`Rasm ${i+1}`} />)}
                  </div>
                </div>
                <div className="spec-thumbstrip">
                  {imgs.map((f,i) => <img key={f} src={`/img/excavators/${f}.jpg`} alt="" className={i===specSlide?'on':''} onClick={() => setSpecSlide(i)} />)}
                </div>
              </>
            })()}
            <div className="spec-body">
              <span className="fl-brand" id="specBrand">{specModel}</span>
              <h3 id="specT">{specModel === 'Volvo' ? 'Volvo EW60E Pro' : specModel === 'Hyundai' ? 'Hyundai R140' : specModel === 'Develon' ? 'Develon DX55W-7' : specModel}</h3>
              <p className="spec-type" dangerouslySetInnerHTML={{ __html: t('flType') }} />
              <table className="spec-tbl"><tbody>
                <tr><th dangerouslySetInnerHTML={{ __html: t('spY') }} /><td>{specModel === 'Volvo' ? '2024' : specModel === 'Hyundai' ? '2011' : '2020'}</td></tr>
                <tr><th dangerouslySetInnerHTML={{ __html: t('spH') }} /><td>{specModel === 'Volvo' ? '1 800' : specModel === 'Hyundai' ? '0' : '4 000'}</td></tr>
                <tr><th>{lang === 'uz' ? 'Holati' : lang === 'ru' ? 'Состояние' : 'Condition'}</th><td>{lang === 'uz' ? 'A\'lo' : lang === 'ru' ? 'Отличное' : 'Excellent'}</td></tr>
                <tr><th>CIP</th><td>{lang === 'uz' ? 'Andijon' : lang === 'ru' ? 'Андижан' : 'Andijan'}</td></tr>
                <tr><th dangerouslySetInnerHTML={{ __html: t('spPr') }} /><td>{lang === 'uz' ? 'So\'rov yuboring' : lang === 'ru' ? 'По запросу' : 'On request'}</td></tr>
              </tbody></table>
              <p className="spec-note" dangerouslySetInnerHTML={{ __html: t('spNote') }} />
              <a className="btn btn-navy" href="#contact" id="specAsk" onClick={closeSpec}><span dangerouslySetInnerHTML={{ __html: t('flAsk') }} /><span className="dot" aria-hidden="true">{ARROW}</span></a>
            </div>
          </form>
        </dialog>

        {/* PROCESS */}
        <section className="sec" id="process">
          <div className="wrap proc">
            <div className="proc-l">
              <span className="tag" dangerouslySetInnerHTML={{ __html: t('pTag') }} />
              <h2 className="rv" style={{ marginTop: 16 }} dangerouslySetInnerHTML={{ __html: t('pTitle') }} />
              <p className="rv" dangerouslySetInnerHTML={{ __html: t('pText') }} />
              <a className="btn btn-navy" href="#contact"><span dangerouslySetInnerHTML={{ __html: t('flAsk') }} /><span className="dot" aria-hidden="true">{ARROW}</span></a>
            </div>
            <ol className="tl" id="tl">
              <span className="tl-line" aria-hidden="true"><i id="tlFill" /></span>
              {[1,2,3,4,5,6].map(n => {
                const nn = String(n).padStart(2, '0')
                return (
                  <li key={n} className="tl-item">
                    <span className="tl-dot">{nn}</span>
                    <div>
                      <h3 dangerouslySetInnerHTML={{ __html: t(`ps${n}t`) }} />
                      <p dangerouslySetInnerHTML={{ __html: t(`ps${n}`) }} />
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        {/* COMPANIES — card grid + modal */}
        <section className="sec" id="companies" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="head">
              <div><span className="tag" dangerouslySetInnerHTML={{ __html: t('cTag') }} /><h2 className="rv" dangerouslySetInnerHTML={{ __html: t('cTitle') }} /></div>
            </div>
            <div className="co-grid">
              {([
                { id:'kortex', name:'Kortex Oil', cat:'catOil', desc:'coKo', logo:'kortex-oil-logo.png', imgs:['kortex-1','kortex-2','koretex-3'] },
                { id:'dream', name:'Dream Express', cat:'catLog', desc:'coDr', logo:'dream-express-logo.jpg', imgs:['dream-image-1','dream-image-2','dream-image-3'] },
                { id:'motors', name:'RT Motors', cat:'catAuto', desc:'coMo', logo:'rt-motors-logo.png', imgs:['motor-1','motor-2','motor-3'] },
                { id:'medline', name:'RT Medline', cat:'catMed', desc:'coMe', logo:'rt-medline-logo.jpg', imgs:['rt-med-1','rt-med-2','rt-med-3'] },
                { id:'aka', name:'aka taxi', cat:'catMob', desc:'coTaxi', logo:'aka-taxi-logo.png', imgs:['aka-taxi-1','aka-taxi-2','aka-taxi-3'] },
                { id:'logistics', name:'RT Logistics', cat:'catLog', desc:'coRl', logo:'rt-logistics-logo.jpg', imgs:['rt-logistics','rt-logistics-2','rt-logistics-3'] },
              ]).map(c=>(
                <article key={c.id} className="co rv" onClick={()=>setExpandedCo(c.id)}>
                  <div className="co-logo-area">
                    <img src={`/img/companies/${c.logo}`} alt={c.name} loading="lazy" />
                  </div>
                  <div className="co-card-body">
                    <span className="co-cat" dangerouslySetInnerHTML={{ __html: t(c.cat) }} />
                    <h3>{c.name}</h3>
                    <p className="co-card-desc" dangerouslySetInnerHTML={{ __html: t(c.desc) }} />
                    <div className="co-card-thumbs">
                      {c.imgs.map(f=>(<img key={f} src={`/img/companies/${f}.jpg`} alt="" width={80} height={80} loading="lazy" />))}
                    </div>
                    <span className="co-card-btn">{t('more')} →</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Company modal */}
        {expandedCo && (
          <div className="co-modal-overlay" onClick={()=>setExpandedCo(null)}>
            <div className="co-modal" onClick={e=>e.stopPropagation()}>
              <button className="co-modal-close" onClick={()=>setExpandedCo(null)} aria-label="Yopish">&times;</button>

              {expandedCo==='kortex' && <>
                <div className="co-modal-gallery">
                  {['kortex-1','kortex-2','koretex-3','kortex-4','kortex-5','kortex-6'].map(f=>(<img key={f} src={`/img/companies/${f}.jpg`} alt="Kortex Oil" width={400} height={400} loading="lazy" />))}
                </div>
                <div className="co-modal-info">
                  <span className="co-cat" dangerouslySetInnerHTML={{ __html: t('catOil') }} />
                  <h2>Kortex Oil</h2>
                  <p dangerouslySetInnerHTML={{ __html: t('coKo') }} />
                  <dl className="co-contacts">
                    <div><dt>{IG}</dt><dd><a href="https://www.instagram.com/kortex_oil/">@kortex_oil</a></dd></div>
                    <div><dt>Email</dt><dd><a href="mailto:kortexoil.kr@gmail.com">kortexoil.kr@gmail.com</a></dd></div>
                    <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+998945639595">+998 94 563 95 95</a></dd></div>
                    <div><dt>Korea</dt><dd><a href="tel:+821029898641">+82 10 2989 8641</a></dd></div>
                  </dl>
                </div>
              </>}

              {expandedCo==='dream' && <>
                <div className="co-modal-gallery">
                  {['dream-image-1','dream-image-2','dream-image-3','dream-image-4','dream-image-5','dream-image-6'].map(f=>(<img key={f} src={`/img/companies/${f}.jpg`} alt="Dream Express" width={400} height={400} loading="lazy" />))}
                </div>
                <div className="co-modal-info">
                  <span className="co-cat" dangerouslySetInnerHTML={{ __html: t('catLog') }} />
                  <h2>Dream Express</h2>
                  <p dangerouslySetInnerHTML={{ __html: t('coDr') }} />
                  <p className="slogan" dangerouslySetInnerHTML={{ __html: t('coDrS') }} />
                  <dl className="co-contacts">
                    <div><dt>{IG}</dt><dd><a href="https://www.instagram.com/expressbts_kr/">@expressbts_kr</a></dd></div>
                    <div><dt>Email</dt><dd><a href="mailto:dreamexpresskr@gmail.com">dreamexpresskr@gmail.com</a></dd></div>
                    <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+821029858641">+82 10 2985 8641</a></dd></div>
                    <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+821029268641">+82 10 2926 8641</a></dd></div>
                  </dl>
                </div>
              </>}

              {expandedCo==='motors' && <>
                <div className="co-modal-gallery">
                  {['motor-1','motor-2','motor-3','motor-4','motor-5','motor-6','motor-7','motor-8','motor-9'].map(f=>(<img key={f} src={`/img/companies/${f}.jpg`} alt="RT Motors" width={400} height={400} loading="lazy" />))}
                </div>
                <div className="co-modal-info">
                  <span className="co-cat" dangerouslySetInnerHTML={{ __html: t('catAuto') }} />
                  <h2>RT Motors</h2>
                  <p dangerouslySetInnerHTML={{ __html: t('coMo') }} />
                  <p className="slogan" dangerouslySetInnerHTML={{ __html: t('coMoS') }} />
                  <dl className="co-contacts">
                    <div><dt dangerouslySetInnerHTML={{ __html: t('lWeb') }} /><dd><a href="https://www.rt-motors.com">rt-motors.com</a></dd></div>
                    <div><dt>{IG}</dt><dd><a href="https://www.instagram.com/rtmotors_trade/">@rtmotors_trade</a></dd></div>
                    <div><dt>Email</dt><dd><a href="mailto:rtmotorssales@gmail.com">rtmotorssales@gmail.com</a></dd></div>
                    <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+821084658085">+82 10 8465 8085</a></dd></div>
                  </dl>
                </div>
              </>}

              {expandedCo==='medline' && <>
                <div className="co-modal-gallery">
                  {['rt-med-1','rt-med-2','rt-med-3','rt-med-4','rt-med-5','rt-med-6','rt-med-7'].map(f=>(<img key={f} src={`/img/companies/${f}.jpg`} alt="RT Medline" width={400} height={400} loading="lazy" />))}
                </div>
                <div className="co-modal-info">
                  <span className="co-cat" dangerouslySetInnerHTML={{ __html: t('catMed') }} />
                  <h2>RT Medline</h2>
                  <p dangerouslySetInnerHTML={{ __html: t('coMe') }} />
                  <dl className="co-contacts">
                    <div><dt dangerouslySetInnerHTML={{ __html: t('lWeb') }} /><dd><a href="https://rtmedline.uz">rtmedline.uz</a></dd></div>
                    <div><dt>{IG}</dt><dd><a href="https://www.instagram.com/rt_medline/">@rt_medline</a></dd></div>
                    <div><dt>Email</dt><dd><a href="mailto:rtmedline@gmail.com">rtmedline@gmail.com</a></dd></div>
                    <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+998940342222">+998 94 034 22 22</a></dd></div>
                  </dl>
                </div>
              </>}

              {expandedCo==='aka' && <>
                <div className="co-modal-gallery">
                  {['aka-taxi-1','aka-taxi-2','aka-taxi-3','aka-4','aka-5','aka-6','aka-7','aka-8','aka-9'].map(f=>(<img key={f} src={`/img/companies/${f}.jpg`} alt="aka taxi" width={400} height={400} loading="lazy" />))}
                </div>
                <div className="co-modal-info">
                  <span className="co-cat" dangerouslySetInnerHTML={{ __html: t('catMob') }} />
                  <h2>aka taxi</h2>
                  <p dangerouslySetInnerHTML={{ __html: t('coTaxi') }} />
                  <dl className="co-contacts">
                    <div><dt>{IG}</dt><dd><a href="https://www.instagram.com/akataxi.uz/">@akataxi.uz</a></dd></div>
                    <div><dt>Email</dt><dd><a href="mailto:akataxi.uz@gmail.com">akataxi.uz@gmail.com</a></dd></div>
                    <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+998999211166">+998 99 921 11 66</a></dd></div>
                    <div><dt>Telegram</dt><dd><a href="https://t.me/akataxi">@akataxi</a></dd></div>
                  </dl>
                </div>
              </>}

              {expandedCo==='logistics' && <>
                <div className="co-modal-gallery">
                  {['rt-logistics','rt-logistics-2','rt-logistics-3','rt-logistcs','rt-logistcs-4','rt-logistcs-6'].map(f=>(<img key={f} src={`/img/companies/${f}.jpg`} alt="RT Logistics" width={400} height={400} loading="lazy" />))}
                </div>
                <div className="co-modal-info">
                  <span className="co-cat" dangerouslySetInnerHTML={{ __html: t('catLog') }} />
                  <h2>RT Logistics</h2>
                  <p dangerouslySetInnerHTML={{ __html: t('coRl') }} />
                  <dl className="co-contacts">
                    <div><dt>{IG}</dt><dd><a href="https://www.instagram.com/rt_logistics/">@rt_logistics</a></dd></div>
                    <div><dt>Email</dt><dd><a href="mailto:rtholdings2020@gmail.com">rtholdings2020@gmail.com</a></dd></div>
                    <div><dt dangerouslySetInnerHTML={{ __html: t('lTel') }} /><dd><a href="tel:+998990114177">+998 99 011 41 77</a></dd></div>
                    <div><dt>Korea</dt><dd><a href="tel:+821096879796">+82 10 9687 9796</a></dd></div>
                  </dl>
                </div>
              </>}

            </div>
          </div>
        )}

        {/* CARGO */}
        <section className="sec navy ribbed" id="cargo">
          <div className="wrap">
            <div className="head">
              <div><span className="tag" dangerouslySetInnerHTML={{ __html: t('kTag') }} /><h2 className="rv" dangerouslySetInnerHTML={{ __html: t('kTitle') }} /></div>
              {t('kText') && <p className="rv" dangerouslySetInnerHTML={{ __html: t('kText') }} />}
            </div>
            <div className="cargo-grid">
              <div className="cargo-poster rv wipe">
                <img src="/img/companies/rt-logistics.jpg" alt="RT Logistics" width={1000} height={1000} loading="lazy" />
                <span className="shine" aria-hidden="true" />
                <div className="fchip fc1"><b><span className="count" data-to="186">186</span>+</b><span dangerouslySetInnerHTML={{ __html: t('n2') }} /></div>
                <div className="fchip fc2"><b><span className="count" data-to="1000">1000</span>+</b><span dangerouslySetInnerHTML={{ __html: t('n4') }} /></div>
              </div>
              <div className="cargo-side">
                <div className="ph-img rv wipe"><img src="/img/companies/rt-logistics-2.jpg" alt="RT Logistics" width={900} height={1200} loading="lazy" /><span dangerouslySetInnerHTML={{ __html: t('k1') }} /></div>
                <div className="ph-img rv wipe" style={{ ['--d' as string]: '.1s' }}><img src="/img/companies/rt-logistics-3.jpg" alt="RT Logistics" width={900} height={1200} loading="lazy" /><span dangerouslySetInnerHTML={{ __html: t('k2') }} /></div>
              </div>
              {/* WORLD MAP */}
              <div className="route rv" id="route">
                <svg viewBox="0 0 1000 440" role="img" aria-label="Koreyadan dunyo bo'ylab yo'nalishlar xaritasi">
                  <path className="land" d={LAND_D} />
                  {ARCS.map(([d, dl], i) => (
                    <g key={i}>
                      <path className="arc" d={d} />
                      <path className="lit" style={{ ['--dl' as string]: dl }} d={d} />
                    </g>
                  ))}
                  <g id="movers" />
                  {DST.map(([cx, cy], i) => <circle key={i} className="dst" cx={cx} cy={cy} r="5" />)}
                  <circle className="pulse" cx="825.0" cy="137.5" r="9" />
                  <circle className="hub" cx="825.0" cy="137.5" r="9" />
                  <text className="city hubl" x="841.0" y="142.5" dangerouslySetInnerHTML={{ __html: t('kr') }} />
                  <text className="city" x="664.4" y="147.6" textAnchor="middle" dangerouslySetInnerHTML={{ __html: t('w1') }} />
                  <text className="city" x="576.7" y="56.4" textAnchor="middle" dangerouslySetInnerHTML={{ __html: t('w2') }} />
                  <text className="city" x="625.8" y="206.2" textAnchor="middle" dangerouslySetInnerHTML={{ __html: t('w3') }} />
                  <text className="city" x="542.8" y="144.7" textAnchor="end" dangerouslySetInnerHTML={{ __html: t('w4') }} />
                  <text className="city" x="488.0" y="80.0" textAnchor="end" dangerouslySetInnerHTML={{ __html: t('w5') }} />
                  <text className="city" x="208.3" y="159.7" textAnchor="middle" dangerouslySetInnerHTML={{ __html: t('w6') }} />
                  <text className="city" x="766.7" y="242.3" textAnchor="middle" dangerouslySetInnerHTML={{ __html: t('w7') }} />
                  <text className="sub" x="990" y="430" textAnchor="end" dangerouslySetInnerHTML={{ __html: t('kMid') }} />
                </svg>
              </div>
              {/* STEPS */}
              <div className="steps">
                {[1,2,3,4].map(n => (
                  <div key={n} className="step rv" style={n > 1 ? { ['--d' as string]: `${(n-1)*0.08}s` } : undefined}>
                    <span className="n">{String(n).padStart(2,'0')}</span>
                    <h3 dangerouslySetInnerHTML={{ __html: t(`s${n}t`) }} />
                    <p dangerouslySetInnerHTML={{ __html: t(`s${n}`) }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="partner">
              <b>RT Logistics</b>
              <a href="https://www.instagram.com/rt_logistics/">{IG}Instagram &middot; @rt_logistics</a>
            </div>
          </div>
        </section>

        {/* AKA */}
        <section className="sec" id="aka">
          <div className="wrap aka">
            <div className="aka-intro">
              <span className="tag" dangerouslySetInnerHTML={{ __html: t('tTag') }} />
              <h2 className="rv" dangerouslySetInnerHTML={{ __html: t('tTitle') }} />
              <img className="pair rv" src="/img/companies/aka-taxi-1.jpg" alt="aka taxi" width={600} height={400} loading="lazy" style={{ borderRadius: 20, width: '100%', maxWidth: 420, objectFit: 'cover' }} />
              <p style={{ color: 'var(--muted)' }} dangerouslySetInnerHTML={{ __html: t('tText') }} />
              <div className="links2" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <a className="btn btn-navy" href="https://www.instagram.com/akataxi.uz/"><span>Instagram</span><span className="dot" aria-hidden="true">{ARROW}</span></a>
                <a className="btn btn-orange" href="https://t.me/akataxi"><span>Telegram</span><span className="dot" aria-hidden="true">{ARROW}</span></a>
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
              <article className="app d rv" style={{ ['--d' as string]: '.1s' }}>
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

        {/* NEWS */}
        <section className="sec" id="news" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="head"><div><span className="tag" dangerouslySetInnerHTML={{ __html: t('nwTag') }} /><h2 className="rv" dangerouslySetInnerHTML={{ __html: t('nwTitle') }} /></div></div>
            <article className="news rv">
              <div className="news-img wipe"><img src="/img/companies/kortex-2.jpg" alt="Kortex Oil" width={900} height={1200} loading="lazy" style={{ objectPosition: 'center 40%' }} /></div>
              <div className="news-txt">
                <div className="news-date"><span className="cal"><b>21</b><small dangerouslySetInnerHTML={{ __html: t('may') }} /></span><span>Kortex Oil &middot; <span dangerouslySetInnerHTML={{ __html: t('nwPlace2') }} /></span></div>
                <h3 dangerouslySetInnerHTML={{ __html: t('nw2H') }} />
                <p dangerouslySetInnerHTML={{ __html: t('nw2P') }} />
                <div className="links2"><a href="https://www.instagram.com/kortex_oil/">{IG}Instagram &middot; @kortex_oil</a></div>
              </div>
            </article>
            <article className="news rev rv">
              <div className="news-img wipe"><img src="/img/signing.jpg" alt="Shartnoma imzolash" width={1000} height={961} loading="lazy" /></div>
              <div className="news-txt">
                <div className="news-date"><span className="cal"><b>6</b><small dangerouslySetInnerHTML={{ __html: t('mar') }} /></span><span>2025 &middot; <span dangerouslySetInnerHTML={{ __html: t('nwPlace2') }} /></span></div>
                <h3 dangerouslySetInnerHTML={{ __html: t('nwH') }} />
                <p dangerouslySetInnerHTML={{ __html: t('nwP') }} />
              </div>
            </article>
          </div>
        </section>

        {/* NUMBERS */}
        <section className="sec navy ribbed" id="numbers">
          <div className="wrap">
            <div className="head"><div><span className="tag" dangerouslySetInnerHTML={{ __html: t('nTag') }} /><h2 className="rv" dangerouslySetInnerHTML={{ __html: t('nTitle') }} /></div></div>
            <div className="nums">
              <div className="num rv"><div className="n"><span className="count" data-to="7">7</span></div><h3 dangerouslySetInnerHTML={{ __html: t('n1') }} /><p dangerouslySetInnerHTML={{ __html: t('n1d') }} /></div>
              <div className="num rv" style={{ ['--d' as string]: '.08s' }}><div className="n"><span className="count" data-to="186">186</span>+</div><h3 dangerouslySetInnerHTML={{ __html: t('n2') }} /><p dangerouslySetInnerHTML={{ __html: t('n2d') }} /></div>
              <div className="num rv" style={{ ['--d' as string]: '.16s' }}><div className="n">2025</div><h3 dangerouslySetInnerHTML={{ __html: t('n3') }} /><p dangerouslySetInnerHTML={{ __html: t('n3d') }} /></div>
              <div className="num rv" style={{ ['--d' as string]: '.24s' }}><div className="n"><span className="count" data-to="1000">1000</span>+</div><h3 dangerouslySetInnerHTML={{ __html: t('n4') }} /><p dangerouslySetInnerHTML={{ __html: t('n4d') }} /></div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="sec" id="contact">
          <div className="wrap">
            <div className="head"><div><span className="tag" dangerouslySetInnerHTML={{ __html: t('ctTag') }} /><h2 className="rv" dangerouslySetInnerHTML={{ __html: t('ctTitle') }} /></div></div>
            <div className="contact">
              <div className="c-info ribbed rv">
                <div><h3 dangerouslySetInnerHTML={{ __html: t('ciT') }} /><p dangerouslySetInnerHTML={{ __html: t('ciP') }} /></div>
                <div className="c-rows">
                  <div className="c-row">
                    <span className="ic" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg></span>
                    <div><small dangerouslySetInnerHTML={{ __html: t('ciPh') }} /><b className="c-multi"><a href="tel:+998945639595">+998 94 563 95 95</a> <span className="cc">UZ</span><br /><a href="tel:+821096879796">+82 10 9687 9796</a> <span className="cc">KR</span></b></div>
                  </div>
                  <div className="c-row">
                    <span className="ic" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg></span>
                    <div><small>Email</small><b className="c-email"><a href="mailto:rtholdings2020@gmail.com">rtholdings2020@gmail.com</a></b></div>
                  </div>
                  <div className="c-row">
                    <span className="ic" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
                    <div><small dangerouslySetInnerHTML={{ __html: t('ciAd') }} /><b dangerouslySetInnerHTML={{ __html: t('ciAdV') }} /></div>
                  </div>
                </div>
              </div>
              <div className="c-form rv" style={{ ['--d' as string]: '.1s' }}>
                <h3 dangerouslySetInnerHTML={{ __html: t('cfT') }} />
                <form id="form" noValidate onSubmit={handleSubmit}>
                  <div className="f"><label htmlFor="f-name" dangerouslySetInnerHTML={{ __html: t('fN') }} /><input id="f-name" autoComplete="name" /></div>
                  <div className="f"><label htmlFor="f-phone" dangerouslySetInnerHTML={{ __html: t('fP') }} /><input id="f-phone" type="tel" autoComplete="tel" /></div>
                  <div className="f full"><label htmlFor="f-co" dangerouslySetInnerHTML={{ __html: t('fS') }} />
                    <select id="f-co">
                      <option dangerouslySetInnerHTML={{ __html: t('oImp') }} />
                      <option dangerouslySetInnerHTML={{ __html: t('oExp') }} />
                      <option dangerouslySetInnerHTML={{ __html: t('oCargo') }} />
                      <option>aka taxi / aka driver</option>
                      <option>RT Medline</option>
                      <option>RT Motors</option>
                      <option>RT Logistics</option>
                      <option dangerouslySetInnerHTML={{ __html: t('oOther') }} />
                    </select>
                  </div>
                  <div className="f full"><label htmlFor="f-msg" dangerouslySetInnerHTML={{ __html: t('fM') }} /><textarea id="f-msg" /></div>
                  <div className="form-foot">
                    <small dangerouslySetInnerHTML={{ __html: t('fFoot') }} />
                    <button className="btn btn-navy" type="submit"><span dangerouslySetInnerHTML={{ __html: t('fSend') }} /><span className="dot" aria-hidden="true">{ARROW}</span></button>
                  </div>
                  <p className="note" id="note" role="status">{formNote}</p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="wrap foot-top">
          <div className="brand"><img src="/img/rt-logo-white.png" alt="RT Holdings" width={720} height={296} loading="lazy" /></div>
          <div className="fcols">
            <div className="fcol"><h4 dangerouslySetInnerHTML={{ __html: t('nCos') }} /><a href="#trade">Kortex Oil</a><a href="#cargo">Dream Express</a><a href="#companies">RT Motors</a><a href="#companies">RT Medline</a><a href="#aka">aka taxi</a></div>
            <div className="fcol"><h4 dangerouslySetInnerHTML={{ __html: t('ftNav') }} /><a href="#about" dangerouslySetInnerHTML={{ __html: t('nAbout') }} /><a href="#news" dangerouslySetInnerHTML={{ __html: t('nNews') }} /><a href="#contact" dangerouslySetInnerHTML={{ __html: t('nContact') }} /></div>
            <div className="fcol"><h4 dangerouslySetInnerHTML={{ __html: t('ftSoc') }} /><a href="https://www.instagram.com/kortex_oil/">@kortex_oil</a><a href="https://www.instagram.com/expressbts_kr/">@expressbts_kr</a><a href="https://www.instagram.com/rtmotors_trade/">@rtmotors_trade</a><a href="https://www.instagram.com/rt_medline/">@rt_medline</a><a href="https://www.instagram.com/akataxi.uz/">@akataxi.uz</a><a href="https://t.me/akataxi">Telegram &middot; akataxi</a></div>
          </div>
        </div>
        <div className="wrap">
          <div className="mega" id="mega" aria-hidden="true">RT Holdings</div>
          <div className="foot-bot"><span>&copy; 2026 RT Holdings</span><span>Your choice is important 4 us</span></div>
        </div>
      </footer>

      {/* FAB */}
      <div className="fab" id="fab">
        <a className="fab-b tg" href="#contact" aria-label="Telegram"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5L18 6.2c.4-.3-.1-.5-.6-.2L6.2 13 1.4 11.5c-1-.3-1-1 .2-1.5L20.5 2.9c.9-.3 1.6.2 1.4 1.4z"/></svg></a>
        <a className="fab-b wa" href="#contact" aria-label="WhatsApp"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3z"/></svg></a>
        <a className="fab-b ph" href="tel:+998945639595" aria-label="Qo'ng'iroq"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg></a>
        <button type="button" className="fab-b up" id="toTop" aria-label="Yuqoriga" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        </button>
      </div>
    </>
  )
}
