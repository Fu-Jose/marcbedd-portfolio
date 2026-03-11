import React from 'react';
import { useLanguage } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';

const HERO_IMAGE_SRC =
  '/images/587010948_18166044031376448_3295146918336194279_n.jpg';

const getCopy = (language: 'en' | 'it') =>
  language === 'it'
    ? {
        kicker: 'Marco Bedini',
        title: 'Sound designer e foley artist per cinema e videogiochi.',
        body: 'Creo paesaggi sonori e mix dinamici per immagini, trailer e progetti interattivi, con una prospettiva che nasce dall’esperienza sul palco e in studio.',
      }
    : {
        kicker: 'Marco Bedini',
        title: 'Sound designer and foley artist for cinema and videogames.',
        body: 'Designing detailed soundscapes and dynamic mixes for picture, trailers and interactive projects, informed by years of experience on stage and in the studio.',
      };

/**
 * Dark side gradient with light text (high contrast / “night” look)
 */
const Hero: React.FC = () => {
  const { language } = useLanguage();
  const copy = getCopy(language);
  const { isDark } = useTheme();

  const accentClass = isDark ? 'text-amber-400' : 'text-orange-600';

  return (
    <section className='mx-auto mt-16 max-w-6xl px-4 md:px-6'>
      <div className='relative overflow-hidden rounded-2xl border border-border/70 bg-card/70'>
        <img
          src={HERO_IMAGE_SRC}
          alt='Marco Bedini rehearsing with a band in the studio'
          className='h-[260px] w-full object-cover sm:h-[320px] md:h-[380px]'
        />

        {/* dark left-to-right gradient, ideal for white text */}
        <div className='pointer-events-none absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent' />

        <div className='absolute inset-0 flex items-center'>
          <div className='w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8'>
            <div className='max-w-xl text-white drop-shadow-[0_1.6px_2px_rgba(0,0,0,0.9)]'>
              <p
                className={[
                  'text-[11px] font-semibold uppercase tracking-[0.24em]',
                  accentClass,
                ].join(' ')}
              >
                {copy.kicker}
              </p>
              <h1 className='mt-2 text-2xl font-semibold leading-tight md:text-3xl'>
                {copy.title}
              </h1>
              <p className='mt-3 text-sm font-medium text-slate-100/90'>
                {copy.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
