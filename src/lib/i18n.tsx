'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Lang, Messages, HeroSlide, HeroData } from './types'

import uz from '../../messages/uz.json'
import ru from '../../messages/ru.json'
import en from '../../messages/en.json'
import heroDataAll from '../../data/hero-slides.json'

const msgs: Record<Lang, Messages> = { uz, ru, en }
const heroData = heroDataAll as HeroData

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  heroSlides: HeroSlide[]
}

const LangContext = createContext<LangContextValue>({
  lang: 'uz',
  setLang: () => {},
  t: (k) => (uz as Messages)[k] ?? k,
  heroSlides: heroData.uz,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('uz')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rt-lang')
      if (saved === 'ru' || saved === 'en' || saved === 'uz') {
        setLangState(saved)
        document.documentElement.lang = saved
      }
    } catch {}
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('rt-lang', l)
    } catch {}
    document.documentElement.lang = l
  }, [])

  const t = useCallback(
    (key: string): string => {
      return msgs[lang]?.[key] ?? msgs.uz[key] ?? key
    },
    [lang],
  )

  const heroSlides = heroData[lang] ?? heroData.uz

  return (
    <LangContext.Provider value={{ lang, setLang, t, heroSlides }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
