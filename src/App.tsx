import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import { LanguageProvider } from './lib/i18n';
import { ThemeProvider } from './lib/theme';
import Credits from './components/sections/Credits';

const About = lazy(() => import('./components/sections/About'));
const WorkGallery = lazy(() => import('./components/player/WorkGallery'));
const Footer = lazy(() => import('./components/layout/Footer'));

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <>
          <Navbar />
          <main>
            <Hero />
            <Suspense fallback={null}>
              <About />
              <WorkGallery />
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <Credits />
        </>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
