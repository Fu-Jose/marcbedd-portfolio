import React, { useState } from 'react';
import { useLanguage } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';

const WEB3FORMS_KEY =
  (import.meta.env.VITE_WEB3FORMS_KEY as string) ?? 'your-access-key-here';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const accentClass = isDark ? 'text-amber-400' : 'text-orange-600';

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const copy =
    language === 'it'
      ? {
          ctaLabel: 'Contatti',
          ctaTitle: 'Avvia un progetto o richiedi il reel completo.',
          heroLabel: 'Collaboriamo',
          heroBody:
            'Disponibile per sound design cinematografico, trailer e progetti multimediali.',
          name: 'Nome',
          email: 'Email',
          projectDetails: 'Dettagli del progetto',
          placeholderName: 'Il tuo nome',
          placeholderEmail: 'tu@example.com',
          placeholderMessage: 'Raccontami il tuo film, gioco o trailer.',
          button: 'Invia messaggio',
          sending: 'Invio in corso…',
          successMsg: 'Messaggio inviato! Ti risponderò il prima possibile.',
          errorMsg:
            'Qualcosa è andato storto. Riprova o scrivimi direttamente.',
        }
      : {
          ctaLabel: 'Contact',
          ctaTitle: 'Start a project or request the full reel.',
          heroLabel: 'Let’s collaborate',
          heroBody:
            'Available for cinematic sound design, trailer work, and interactive media.',
          name: 'Name',
          email: 'Email',
          projectDetails: 'Project details',
          placeholderName: 'Your name',
          placeholderEmail: 'you@example.com',
          placeholderMessage: 'Tell me about your film, game, or trailer.',
          button: 'Send message',
          sending: 'Sending…',
          successMsg: 'Message sent! I’ll get back to you as soon as possible.',
          errorMsg:
            'Something went wrong. Please try again or reach out directly.',
        };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...data }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <footer
      id='contact'
      className='mt-16 border-t border-border/70 bg-background/80 py-10 text-sm text-muted-foreground'
    >
      <div className='mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 md:px-6'>
        <div className='relative overflow-hidden rounded-2xl border border-border/70 bg-card/70'>
          <img
            src='/images/pexels-chuck-3587496.jpg'
            alt='Studio desk with laptop and mixing console'
            className='h-full w-full object-cover'
          />
          <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 via-background/0 to-transparent' />
          <div className='pointer-events-none absolute inset-x-0 bottom-0 p-4'>
            <p
              className={[
                'text-xs font-semibold uppercase tracking-[0.24em]',
                accentClass,
              ].join(' ')}
            >
              {copy.heroLabel}
            </p>
            <p className='mt-1 text-sm font-medium text-foreground'>
              {copy.heroBody}
            </p>
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <p
              className={[
                'text-xs font-semibold uppercase tracking-[0.24em]',
                accentClass,
              ].join(' ')}
            >
              {copy.ctaLabel}
            </p>
            <h2 className='mt-1 text-base font-semibold text-foreground'>
              {copy.ctaTitle}
            </h2>
          </div>

          <form className='space-y-4' onSubmit={handleSubmit}>
            {/* Web3Forms honeypot – anti-spam */}
            <input type='checkbox' name='botcheck' className='hidden' />

            <div className='space-y-1.5'>
              <label
                htmlFor='contact-name'
                className='text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground'
              >
                {copy.name}
              </label>
              <input
                id='contact-name'
                name='name'
                type='text'
                required
                className='w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                placeholder={copy.placeholderName}
              />
            </div>

            <div className='space-y-1.5'>
              <label
                htmlFor='contact-email'
                className='text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground'
              >
                {copy.email}
              </label>
              <input
                id='contact-email'
                name='email'
                type='email'
                required
                className='w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                placeholder={copy.placeholderEmail}
              />
            </div>

            <div className='space-y-1.5'>
              <label
                htmlFor='contact-message'
                className='text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground'
              >
                {copy.projectDetails}
              </label>
              <textarea
                id='contact-message'
                name='message'
                rows={4}
                required
                className='w-full resize-none rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                placeholder={copy.placeholderMessage}
              />
            </div>

            <button
              type='submit'
              disabled={status === 'loading' || status === 'success'}
              className='inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {status === 'loading' ? copy.sending : copy.button}
            </button>
          </form>

          {status === 'success' && (
            <p className='pt-2 text-xs font-medium text-green-600 dark:text-green-400'>
              {copy.successMsg}
            </p>
          )}
          {status === 'error' && (
            <p className='pt-2 text-xs font-medium text-red-600 dark:text-red-400'>
              {copy.errorMsg}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
