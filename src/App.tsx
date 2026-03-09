import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import SoundCloudGrid from "./components/sections/SoundCloudGrid";
import Footer from "./components/layout/Footer";
import WorkGallery from "./components/player/WorkGallery";
import { LanguageProvider } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme";

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <>
          <Navbar />
          <Hero />
          <About />
          <WorkGallery />
          <SoundCloudGrid />
          <Footer />
        </>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
