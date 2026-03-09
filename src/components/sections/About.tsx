import React from 'react';
import { useLanguage } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';

const About: React.FC = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const accentClass = isDark ? 'text-amber-400' : 'text-orange-600';

  const copy =
    language === 'it'
      ? {
          label: 'Chi sono',
          title: 'Sound designer cinematografico al servizio del racconto.',
          p1: 'Mi chiamo Marco Bedini e mi occupo di sound design per film, trailer e videogiochi. Mi interessa creare ambienti sonori che respirano con le immagini, unendo registrazioni originali, editing accurato e mix immersivi.',
          p2: 'Negli anni ho lavorato su cortometraggi indipendenti, spot pubblicitari e contenuti brevi, seguendo spesso l’intero flusso: dalla pulizia del dialogo alla creazione di effetti sonori, dal layering di ambience fino alla consegna finale in stereo.',
          p3: 'Dal palco allo studio porto un approccio musicale al suono: attenzione a ritmo, timbro e dinamica, ma soprattutto alla collaborazione con registi, montatori e compositori per trasformare i brief in scelte sonore chiare e funzionali alla storia.',
        }
      : {
          label: 'About',
          title: 'Cinematic sound designer crafting narrative-driven mixes.',
          p1: 'I’m Marco Bedini, a sound designer working across films, trailers and games. I enjoy building sound worlds that move with the picture, blending original recordings, detailed editing and immersive mixing.',
          p2: 'My work includes independent shorts, commercial spots and other short‑form pieces, often following the whole chain: from production dialogue clean‑up to creative sound effects, ambience layering and final stereo delivery.',
          p3: 'Coming from both stage and studio, I bring a musical approach to rhythm, tone and dynamics, and I like to collaborate closely with directors, editors and composers to turn their ideas into clear, story‑driven sound choices.',
        };

  return (
    <section
      id='about'
      className='mx-auto mt-16 flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:px-6'
    >
      <div className='relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 md:w-1/2'>
        <img
          src='/images/624775413_18171611545376448_7878141069178213613_n.jpg'
          alt='Portrait of Marco Bedini holding a saxophone'
          className='h-full w-full object-cover'
        />
        <div className='pointer-events-none absolute inset-0 bg-linear-to-t  to-transparent' />
      </div>

      <div className='space-y-4 md:w-1/2'>
        <p
          className={[
            'text-xs font-semibold uppercase tracking-[0.24em]',
            accentClass,
          ].join(' ')}
        >
          {copy.label}
        </p>
        <h2 className='text-xl font-semibold leading-tight md:text-2xl'>
          {copy.title}
        </h2>
        <p className='text-sm text-muted-foreground'>{copy.p1}</p>
        <p className='text-sm text-muted-foreground'>{copy.p2}</p>
        <p className='text-sm text-muted-foreground'>{copy.p3}</p>
      </div>
    </section>
  );
};

export default About;
