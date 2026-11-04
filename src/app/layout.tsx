import type { Metadata } from 'next'
import { Unbounded, Onest, Oswald, Raleway } from 'next/font/google'
import './globals.css'

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--f-display',
})

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--f-body',
})

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--f-oswald',
})

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '600'],
  display: 'swap',
  variable: '--f-raleway',
})

export const metadata: Metadata = {
  title: 'RT Holdings',
  description: 'RT Holdings — Janubiy Koreya va O\'zbekistonda motor moylari, kargo, avtomobil savdosi, tibbiyot va mobillik yo\'nalishlarini birlashtirgan kompaniyalar guruhi.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" className={`${unbounded.variable} ${onest.variable} ${oswald.variable} ${raleway.variable}`}>
      <body>{children}</body>
    </html>
  )
}
