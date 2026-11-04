'use client';

import { I18nProvider } from '@/i18n/context';
import Header from '@/components/Header';
import MenuOverlay from '@/components/MenuOverlay';
import Hero from '@/components/Hero';
import BrandMarquee from '@/components/BrandMarquee';
import MotionBand from '@/components/MotionBand';
import About from '@/components/About';
import TradeCards from '@/components/TradeCards';
import Fleet from '@/components/Fleet';
import ProcessTimeline from '@/components/ProcessTimeline';
import CompanyCards from '@/components/CompanyCards';
import Cargo from '@/components/Cargo';
import AkaApps from '@/components/AkaApps';
import News from '@/components/News';
import Stats from '@/components/Stats';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { useScrollEffects } from '@/hooks/useScrollEffects';

function ScrollEffects() {
  useScrollEffects();
  return null;
}

export default function Home() {
  return (
    <I18nProvider>
      <Header />
      <MenuOverlay />
      <main>
        <Hero />
        <BrandMarquee />
        <MotionBand />
        <About />
        <TradeCards />
        <Fleet />
        <ProcessTimeline />
        <CompanyCards />
        <Cargo />
        <AkaApps />
        <News />
        <Stats />
        <ContactSection />
      </main>
      <Footer />
      <FloatingActions />
      <ScrollEffects />
    </I18nProvider>
  );
}
