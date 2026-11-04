'use client';

import { useI18n } from '@/i18n/context';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer>
      <div className="wrap foot-top">
        <div className="brand">
          <img src="/img/rt-logo-white.png" alt="RT Holdings — Your choice is important 4 us" width={720} height={296} loading="lazy" />
        </div>
        <div className="fcols">
          <div className="fcol">
            <h4 dangerouslySetInnerHTML={{ __html: t('nCos') }} />
            <a href="#trade">Kortex Oil</a>
            <a href="#cargo">Dream Express</a>
            <a href="#companies">RT Motors</a>
            <a href="#companies">RT Logistics</a>
            <a href="#companies">RT Medline</a>
            <a href="#aka">aka taxi</a>
          </div>
          <div className="fcol">
            <h4 dangerouslySetInnerHTML={{ __html: t('ftNav') }} />
            <a href="#about" dangerouslySetInnerHTML={{ __html: t('nAbout') }} />
            <a href="#news" dangerouslySetInnerHTML={{ __html: t('nNews') }} />
            <a href="#contact" dangerouslySetInnerHTML={{ __html: t('nContact') }} />
          </div>
          <div className="fcol">
            <h4 dangerouslySetInnerHTML={{ __html: t('ftSoc') }} />
            <a href="https://www.instagram.com/rt_holdings/">@rt_holdings</a>
            <a href="https://www.instagram.com/kortex_oil/">@kortex_oil</a>
            <a href="https://www.instagram.com/expressbts_kr/">@expressbts_kr</a>
            <a href="https://www.instagram.com/rtmotors_trade/">@rtmotors_trade</a>
            <a href="https://www.instagram.com/rt_medline/">@rt_medline</a>
            <a href="https://www.instagram.com/rt_logistics/">@rt_logistics</a>
            <a href="https://www.instagram.com/akataxi.uz/">@akataxi.uz</a>
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="mega" id="mega" aria-hidden="true">RT Holdings</div>
        <div className="foot-bot">
          <span>© 2026 RT Holdings</span>
          <span>Your choice is important 4 us</span>
        </div>
      </div>
    </footer>
  );
}
