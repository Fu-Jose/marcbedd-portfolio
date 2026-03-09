import React from 'react';
import { Moon, SunMedium } from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';

const Navbar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const t = {
    brand: 'Marcbedd Sound Designer',
    about: language === 'it' ? 'Chi sono' : 'About',
    work: language === 'it' ? 'Lavori' : 'Work',
    contact: language === 'it' ? 'Contatti' : 'Contact',
  };

  return (
    <header className='sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl'>
      <nav className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6'>
        <a href='#top' className='flex items-center gap-3'>
          <img
            src={isDark ? '/logo/POSITIVO BIANCO.svg' : '/logo/POSITIVO.svg'}
            alt='Marcbedd logo'
            className='h-8 w-auto md:h-9'
          />
          <span className='text-sm font-semibold tracking-[0.24em] uppercase text-foreground'>
            {t.brand}
          </span>
        </a>

        <div className='flex items-center gap-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground'>
          <div className='hidden items-center gap-4 sm:flex'>
            <a href='#about' className='hover:text-foreground'>
              {t.about}
            </a>
            <a href='#work' className='hover:text-foreground'>
              {t.work}
            </a>
            <a href='#contact' className='hover:text-foreground'>
              {t.contact}
            </a>
          </div>

          <div className='flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-1 py-0.5'>
            <button
              type='button'
              onClick={() => setLanguage('en')}
              className={[
                'rounded-full px-2 py-1 text-[10px] font-semibold',
                language === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              ENG
            </button>
            <button
              type='button'
              onClick={() => setLanguage('it')}
              className={[
                'rounded-full px-2 py-1 text-[10px] font-semibold',
                language === 'it'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              ITA
            </button>
          </div>

          <button
            type='button'
            onClick={toggleTheme}
            className='inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-card/80 text-muted-foreground hover:text-foreground'
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Moon className='h-4 w-4' />
            ) : (
              <SunMedium className='h-4 w-4' />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
