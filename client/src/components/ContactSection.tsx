'use client';

import { useI18n } from '@/i18n/context';
import { useCallback, useState } from 'react';

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M8 7h9v9" /></svg>
);

export default function ContactSection() {
  const { t } = useI18n();
  const [note, setNote] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('f-name') as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem('f-phone') as HTMLInputElement).value.trim();
    if (!name || !phone) {
      setNote(t('errReq'));
      return;
    }
    try {
      const prev = JSON.parse(localStorage.getItem('rt-cms-contacts') || '[]');
      prev.unshift({
        id: String(Date.now()),
        name,
        phone,
        service: (form.elements.namedItem('f-co') as HTMLSelectElement).value,
        message: (form.elements.namedItem('f-msg') as HTMLTextAreaElement).value.trim(),
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        read: false,
      });
      localStorage.setItem('rt-cms-contacts', JSON.stringify(prev));
    } catch {}
    setNote(t('okDemo'));
    form.reset();
  }, [t]);

  return (
    <section className="sec" id="contact">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="tag" dangerouslySetInnerHTML={{ __html: t('ctTag') }} />
            <h2 className="rv" dangerouslySetInnerHTML={{ __html: t('ctTitle') }} />
          </div>
        </div>
        <div className="contact">
          <div className="c-info ribbed rv">
            <div>
              <h3 dangerouslySetInnerHTML={{ __html: t('ciT') }} />
              <p dangerouslySetInnerHTML={{ __html: t('ciP') }} />
            </div>
            <div className="c-rows">
              <div className="c-row">
                <span className="ic" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
                </span>
                <div>
                  <small dangerouslySetInnerHTML={{ __html: t('ciPh') }} />
                  <b className="c-multi">
                    <a href="tel:+998945639595">+998 94 563 95 95</a> <span className="cc">UZ</span><br />
                    <a href="tel:+821096879796">+82 10 9687 9796</a> <span className="cc">KR</span>
                  </b>
                </div>
              </div>
              <div className="c-row">
                <span className="ic" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16v12H4z" /><path d="M4 7l8 6 8-6" /></svg>
                </span>
                <div>
                  <small>Email</small>
                  <b className="c-email"><a href="mailto:rtholdings2020@gmail.com">rtholdings2020@gmail.com</a></b>
                </div>
              </div>
              <div className="c-row">
                <span className="ic" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>
                </span>
                <div>
                  <small dangerouslySetInnerHTML={{ __html: t('ciAd') }} />
                  <b dangerouslySetInnerHTML={{ __html: t('ciAdV') }} />
                </div>
              </div>
            </div>
          </div>
          <div className="c-form rv" style={{ '--d': '.1s' } as React.CSSProperties}>
            <h3 dangerouslySetInnerHTML={{ __html: t('cfT') }} />
            <form id="form" noValidate onSubmit={handleSubmit}>
              <div className="f">
                <label htmlFor="f-name" dangerouslySetInnerHTML={{ __html: t('fN') }} />
                <input id="f-name" autoComplete="name" />
              </div>
              <div className="f">
                <label htmlFor="f-phone" dangerouslySetInnerHTML={{ __html: t('fP') }} />
                <input id="f-phone" type="tel" autoComplete="tel" />
              </div>
              <div className="f full">
                <label htmlFor="f-co" dangerouslySetInnerHTML={{ __html: t('fS') }} />
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
              <div className="f full">
                <label htmlFor="f-msg" dangerouslySetInnerHTML={{ __html: t('fM') }} />
                <textarea id="f-msg" />
              </div>
              <div className="form-foot">
                <small dangerouslySetInnerHTML={{ __html: t('fFoot') }} />
                <button className="btn btn-navy" type="submit">
                  <span dangerouslySetInnerHTML={{ __html: t('fSend') }} />
                  <span className="dot" aria-hidden="true"><ArrowIcon /></span>
                </button>
              </div>
              {note && <p className="note" id="note" role="status">{note}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
