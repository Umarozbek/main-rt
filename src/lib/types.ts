export type Lang = 'uz' | 'ru' | 'en'

export interface HeroSlide {
  g: string[]
  h: [number, number, string, string][]
}

export type Messages = Record<string, string>

export interface HeroData {
  uz: HeroSlide[]
  ru: HeroSlide[]
  en: HeroSlide[]
}
