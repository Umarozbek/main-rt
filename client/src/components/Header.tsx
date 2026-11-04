'use client';

import { useEffect, useState, useCallback } from 'react';
import { useI18n, type Lang } from '@/i18n/context';
import { menuState } from './menuState';

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return menuState.subscribe(setMenuOpen);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  const toggleMenu = useCallback(() => {
    menuState.toggle();
  }, []);

  const langs: Lang[] = ['uz', 'ru', 'en'];

  return (
    <header
      className={`hdr${solid ? ' solid' : ''}${menuOpen ? ' solid' : ''}`}
      id="hdr"
    >
      <div className="wrap hbar">
        <div className="hleft">
          <button
            className="burger"
            id="burger"
            type="button"
            aria-label="Menyu"
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
          <a className="logo" href="#top">
            <img
              className="lg-dark"
              src="/img/rt-logo.png"
              alt="RT Holdings"
              width={720}
              height={296}
            />
            <img
              className="lg-light"
              src="/img/rt-logo-white.png"
              alt=""
              aria-hidden="true"
              width={720}
              height={296}
            />
          </a>
        </div>
        <div className="hright">
          <a className="ilink" href="#companies">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span>{t('nCos')}</span>
          </a>
          <a className="ilink" href="#contact">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>{t('hLoc')}</span>
          </a>
          <a className="ilink" href="#contact">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            </svg>
            <span>{t('nContact')}</span>
          </a>
          <div className="lang" role="group" aria-label="Til">
            {langs.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
