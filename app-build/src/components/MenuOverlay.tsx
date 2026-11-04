'use client';

import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/i18n/context';
import { menuState } from './menuState';

const menuLinks = [
  { num: '01', key: 'nAbout', href: '#about' },
  { num: '02', key: 'trTitle', href: '#trade' },
  { num: '03', key: 'nCos', href: '#companies' },
  { num: '04', key: 'nCargo', href: '#cargo' },
  { num: '05', key: 'nAka', href: '#aka' },
  { num: '06', key: 'nNews', href: '#news' },
  { num: '07', key: 'pTag', href: '#process' },
  { num: '08', key: 'nContact', href: '#contact' },
];

export default function MenuOverlay() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return menuState.subscribe(setOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') menuState.close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleClick = useCallback(() => {
    menuState.close();
  }, []);

  return (
    <div className="menu" id="menu" hidden={!open || undefined}>
      <div className="wrap menu-in">
        <nav aria-label="Asosiy menyu" className="menu-links">
          {menuLinks.map((item) => (
            <a key={item.href} href={item.href} onClick={handleClick}>
              <small>{item.num}</small>
              <span>{t(item.key)}</span>
            </a>
          ))}
        </nav>
        <p className="menu-tag">Your choice is important 4 us</p>
      </div>
    </div>
  );
}
