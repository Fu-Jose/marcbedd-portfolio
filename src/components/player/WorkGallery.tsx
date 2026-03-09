import React from 'react';
import InteractivePlayer from './InteractivePlayer';
import { useLanguage } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';

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
        }
      : {
          label: 'Interactive reels',
          title:
            'Explore the mix by toggling dialogue, FX, ambience, and music.',
        };

  return (
    <div id='work' className='w-full bg-background/40'>
      <section className='mx-auto mt-16 max-w-6xl space-y-4 px-4 md:px-6'>
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
    </div>
  );
};

export default WorkGallery;
