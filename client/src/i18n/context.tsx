'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

import uz from '../../../messages/uz.json';
import ru from '../../../messages/ru.json';
import en from '../../../messages/en.json';
import heroData from '../../../data/hero-slides.json';

export type Lang = 'uz' | 'ru' | 'en';

const messages: Record<Lang, Record<string, string>> = { uz, ru, en };
const heroSlides = heroData as Record<
  Lang,
  { g: string[]; h: [number, number, string, string][] }[]
>;

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  hero: { g: string[]; h: [number, number, string, string][] }[];
}

const I18nContext = createContext<I18nContextValue>(null!);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('uz');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rt-lang') as Lang | null;
      if (saved && messages[saved]) setLangState(saved);
    } catch {}
    setMounted(true);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('rt-lang', l);
    } catch {}
    document.documentElement.lang = l;
  }, []);

  useEffect(() => {
    if (mounted) document.documentElement.lang = lang;
  }, [lang, mounted]);

  const t = useCallback(
    (key: string) => messages[lang]?.[key] ?? messages.uz[key] ?? key,
    [lang],
  );

  const hero = heroSlides[lang] ?? heroSlides.uz;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, hero }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
