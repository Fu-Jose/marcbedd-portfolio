import React from 'react';
import { useLanguage } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';

const About: React.FC = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const accentClass = isDark ? 'text-amber-400' : 'text-orange-600';

  const CV_URL =
    'https://res.cloudinary.com/donxjonx/image/upload/v1773067198/marcbedd/Marco_Bedini_Resume_Gen26_Eng_nbesr0.pdf';
  const FILM_48H_URL = 'https://www.youtube.com/watch?v=-ay5wInOtcY';

  const copy =
    language === 'it'
      ? {
          label: 'Chi sono',
          title: 'Sound designer al servizio del racconto.',
          p1: 'Sono Marco Bedini, sound designer e foley artist per film, trailer e videogiochi. Mi specializzo nella costruzione di mondi sonori immersivi che respirano con le immagini, integrando spesso il mio background da sassofonista nelle produzioni.',
          p2: "Dalla pulizia del dialogo alla consegna finale, ho gestito l'intera catena audio per cortometraggi indipendenti e spot pubblicitari. Nel 2024 ho composto la musica per un cortometraggio del 48 Hour Film Project — prodotto in 48 ore — che ha vinto come Miglior Cortometraggio in Italia.",
          techTitle: 'Competenze tecniche',
          bullets: [
            { label: 'DAW', value: 'Steinberg Certified (Cubase)' },
            {
              label: 'Tools',
              value: 'Spectralayers, iZotope RX',
            },
            {
              label: 'Specializzazione',
              value:
                'Music Composition & Sound Design, Analisi forense del suono (LCFT Advanced Certificate)',
            },
            {
              label: 'Formazione',
              value:
                'Scuola Internazionale di Comics, London College of Foreign Trade & MasAcademy',
            },
          ],
          cvLabel: 'Scarica CV',
          film48hLabel: 'Guarda il corto premiato',
        }
      : {
          label: 'About',
          title: 'Sound designer crafting narrative-driven mixes.',
          p1: "I'm Marco Bedini, a sound designer and foley artist working across films, trailers, and games. I specialize in building immersive sound worlds that breathe with the picture, often weaving my background as a saxophonist into my productions.",
          p2: "From dialogue clean-up to final delivery, I've handled the full audio chain for independent shorts and commercial spots. In 2024, I composed the music for a 48 Hour Film Project short — made entirely in 48 hours — that won Best Short Film in Italy.",
          techTitle: 'Technical Expertise',
          bullets: [
            { label: 'DAW', value: 'Steinberg Certified (Cubase)' },
            {
              label: 'Tools',
              value: 'Spectralayers, iZotope RX',
            },
            {
              label: 'Specialization',
              value:
                'Music Composition & Sound Design, Forensic Audio Analysis (LCFT Advanced Certificate)',
            },
            {
              label: 'Training',
              value:
                'Scuola Internazionale di Comics, London College of Foreign Trade & MasAcademy',
            },
          ],
          cvLabel: 'Download CV',
          film48hLabel: 'Watch the award-winning short',
        };

  const { cvLabel, film48hLabel } = copy;

  return (
    <section
      id='about'
      className='mx-auto mt-16 flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:px-6'
    >
      <div className='relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 md:w-1/2'>
        <img
          src='/images/portrait.webp'
          srcSet='/images/portrait-400.webp 400w, /images/portrait.webp 800w'
          sizes='(max-width: 768px) 100vw, 50vw'
          alt='Portrait of Marco Bedini holding a saxophone'
          width={800}
          height={998}
          loading='lazy'
          decoding='async'
          className='h-full w-full object-cover'
        />
        <div className='pointer-events-none absolute inset-0 bg-linear-to-t to-transparent' />
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

        {/* Technical expertise bullets */}
        <div className='space-y-2'>
          <p
            className={[
              'text-xs font-semibold uppercase tracking-[0.2em]',
              accentClass,
            ].join(' ')}
          >
            {copy.techTitle}
          </p>
          <ul className='space-y-1'>
            {copy.bullets.map((item) => (
              <li key={item.label} className='flex flex-col gap-0.5 text-sm'>
                <span
                  className={['shrink-0 font-semibold', accentClass].join(' ')}
                >
                  {item.label}:
                </span>
                <span className='text-muted-foreground'>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-wrap gap-3 pt-1'>
          <a
            href={CV_URL}
            target='_blank'
            rel='noreferrer'
            className={[
              'inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition hover:opacity-80',
              isDark
                ? 'border-amber-400 text-amber-400'
                : 'border-orange-600 text-orange-600',
            ].join(' ')}
          >
            ↓ {cvLabel}
          </a>
          <a
            href={FILM_48H_URL}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-1.5 rounded-full border border-border/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground'
          >
            ▶ {film48hLabel}
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
