import React from 'react';
import InteractivePlayer from './InteractivePlayer';
import { useLanguage } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';

const SPOTIFY_TRACKS = [
  {
    id: '13jMxAHQcOhboih1C1GdVM',
    label: 'Anna Bielli – EP (Track 1)',
  },
  {
    id: '0y9E3xafSSc9ytnlRQOEE4',
    label: 'Anna Bielli – EP (Track 2)',
  },
];

const CREDITS = [
  {
    titleIt: 'Compagne Di Strada – Beatrice Miano',
    titleEn: 'Compagne Di Strada – Beatrice Miano',
    detailIt:
      'Traccia originale e sound design; Le Bestevem, prod. Antonio Roman',
    detailEn:
      'Original track and sound design; Le Bestevem, prod. by Antonio Roman',
  },
  {
    titleIt: 'Handycam',
    titleEn: 'Handycam',
    detailIt: 'Cortometraggio di Giacomo Foschini',
    detailEn: 'Short film by Giacomo Foschini',
  },
  {
    titleIt: 'Veleno Bianco',
    titleEn: 'Veleno Bianco',
    detailIt: 'Cortometraggio di Gabriele Bordonaro',
    detailEn: 'Short film by Gabriele Bordonaro',
  },
  {
    titleIt: 'Di Marketing e Miracoli',
    titleEn: 'Di Marketing e Miracoli',
    detailIt: 'Cortometraggio di Serena Lazzaro',
    detailEn: 'Short film by Serena Lazzaro',
  },
];

const WorkGallery: React.FC = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const accentClass = isDark ? 'text-amber-400' : 'text-orange-600';

  const copy =
    language === 'it'
      ? {
          label: 'Reel interattivi',
          title:
            'Esplora il mix attivando e disattivando dialoghi, FX, ambience e musica.',
          spotifyLabel: 'Mix & Master',
          spotifyTitle: 'Mix e master di un EP per Anna Bielli.',
          creditsLabel: 'Composizione & Sound Design',
          creditsTitle: 'Altri progetti selezionati.',
        }
      : {
          label: 'Interactive reels',
          title:
            'Explore the mix by toggling dialogue, FX, ambience, and music.',
          spotifyLabel: 'Mix & Master',
          spotifyTitle: 'Mix and master of an EP by Anna Bielli.',
          creditsLabel: 'Composition & Sound Design',
          creditsTitle: 'Other selected projects.',
        };

  const spotifyTheme = isDark ? 'dark' : 'light';

  return (
    <div id='work' className='w-full bg-background/40'>
      <section className='mx-auto mt-16 max-w-6xl space-y-4 px-4 md:px-6'>
        {/* Interactive reels */}
        <header className='space-y-1'>
          <p
            className={[
              'text-xs font-semibold uppercase tracking-[0.24em]',
              accentClass,
            ].join(' ')}
          >
            {copy.label}
          </p>
          <h2 className='text-lg font-semibold leading-tight sm:text-xl'>
            {copy.title}
          </h2>
        </header>
        <InteractivePlayer />
      </section>

      {/* Spotify — Mix & Master */}
      <section className='mx-auto mt-16 max-w-6xl space-y-4 px-4 md:px-6'>
        <header className='space-y-1'>
          <p
            className={[
              'text-xs font-semibold uppercase tracking-[0.24em]',
              accentClass,
            ].join(' ')}
          >
            {copy.spotifyLabel}
          </p>
          <h2 className='text-lg font-semibold leading-tight sm:text-xl'>
            {copy.spotifyTitle}
          </h2>
        </header>
        <div className='grid gap-4 sm:grid-cols-2'>
          {SPOTIFY_TRACKS.map((track) => (
            <div
              key={track.id}
              className='overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm'
            >
              <iframe
                title={track.label}
                src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=${spotifyTheme === 'dark' ? '0' : ''}`}
                width='100%'
                height='152'
                frameBorder='0'
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                loading='lazy'
              />
            </div>
          ))}
        </div>
      </section>

      {/* Credits — Composition & Sound Design */}
      <section className='mx-auto mt-16 max-w-6xl space-y-4 px-4 md:px-6'>
        <header className='space-y-1'>
          <p
            className={[
              'text-xs font-semibold uppercase tracking-[0.24em]',
              accentClass,
            ].join(' ')}
          >
            {copy.creditsLabel}
          </p>
          <h2 className='text-lg font-semibold leading-tight sm:text-xl'>
            {copy.creditsTitle}
          </h2>
        </header>
        <ul className='divide-y divide-border/50 rounded-2xl border border-border/70 bg-card/80 shadow-sm'>
          {CREDITS.map((item) => (
            <li key={item.titleEn} className='flex flex-col gap-0.5 px-4 py-3'>
              <span className='text-sm font-medium text-foreground'>
                {language === 'it' ? item.titleIt : item.titleEn}
              </span>
              <span className='text-xs text-muted-foreground'>
                {language === 'it' ? item.detailIt : item.detailEn}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default WorkGallery;
