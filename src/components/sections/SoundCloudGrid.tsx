import React from 'react';
import { useLanguage } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';

const SoundCloudGrid: React.FC = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const profileUrl = 'https://soundcloud.com/marco-bedini';
  const widgetColor = isDark ? '%23f5f5f5' : '%23211c2b';
  const widgetUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    profileUrl,
  )}&color=${widgetColor}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;

  const copy =
    language === 'it'
      ? {
          label: 'Musica & cue',
          title: 'Selezione di musica e sound design da SoundCloud.',
          description:
            'Ascolta altri brani, mix alternativi e cue standalone direttamente dal mio profilo SoundCloud.',
          footerPrefix: 'Riproduzione da',
        }
      : {
          label: 'Music & cues',
          title: 'Selected music and sound design from SoundCloud.',
          description:
            'Stream additional tracks, alternate mixes and standalone cues directly from my SoundCloud profile without leaving the site.',
          footerPrefix: 'Playing directly from',
        };

  return (
    <section
      id='music'
      className='mx-auto mt-16 flex max-w-6xl flex-col gap-4 px-4 md:px-6'
    >
      <header className='space-y-1'>
        <p
          className={[
            'text-xs font-semibold uppercase tracking-[0.24em]',
            isDark ? 'text-amber-400' : 'text-orange-600',
          ].join(' ')}
        >
          {copy.label}
        </p>
        <h2 className='text-lg font-semibold leading-tight sm:text-xl'>
          {copy.title}
        </h2>
        <p className='text-sm text-muted-foreground'>{copy.description}</p>
      </header>

      <div className='overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm'>
        <div className='relative h-160 sm:h-130 md:h-115'>
          <iframe
            title='Marco Bedini – SoundCloud'
            className='absolute inset-0 h-full w-full'
            allow='autoplay'
            loading='lazy'
            src={widgetUrl}
          />
        </div>
        <div className='flex items-center justify-between gap-2 border-t border-border/70 bg-background/60 px-4 py-2 text-xs text-muted-foreground'>
          <span>
            {copy.footerPrefix}{' '}
            <a
              href={profileUrl}
              target='_blank'
              rel='noreferrer'
              className='font-medium underline-offset-2 hover:underline'
            >
              SoundCloud / Marco Bedini
            </a>
          </span>
        </div>
      </div>
    </section>
  );
};

export default SoundCloudGrid;
