import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Loader2, Play } from 'lucide-react';
import * as Tone from 'tone';
import VideoDisplay from './VideoDisplay';
import MixerPanel from './MixerPanel';
import { useTonePlayer } from './useTonePlayer';
import { useLanguage } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';

type Stem = { id: string; label: string; file: string };
type PlaylistItem = {
  id: string;
  title: string;
  description?: string;
  descriptionIt?: string;
  videoSrc: string;
  stems: Stem[];
};
type StemState = { volume: number; muted: boolean };

const AVATAR_STEMS: Stem[] = [
  {
    id: 'avatar-ambient',
    label: 'Ambient',
    file: 'https://res.cloudinary.com/donxjonx/video/upload/f_auto,q_auto/v1773067178/marcbedd/audio/avatar/Thanator_Ambient_szawdp.mp3',
  },
  {
    id: 'avatar-jake-movement',
    label: 'Jake Sully Movement',
    file: 'https://res.cloudinary.com/donxjonx/video/upload/f_auto,q_auto/v1773067180/marcbedd/audio/avatar/Thanator_Jake_Sully_movement_nqdtvk.mp3',
  },
  {
    id: 'avatar-music-texture',
    label: 'Music & Texture',
    file: 'https://res.cloudinary.com/donxjonx/video/upload/f_auto,q_auto/v1773067177/marcbedd/audio/avatar/Thanator_Music_and_Texture_sb0qep.mp3',
  },
  {
    id: 'avatar-roar',
    label: 'Roar SFX',
    file: 'https://res.cloudinary.com/donxjonx/video/upload/f_auto,q_auto/v1773067178/marcbedd/audio/avatar/Thanator_Roar_SD_lcx40w.mp3',
  },
];
const LDR_VACUUM_STEMS: Stem[] = [
  {
    id: 'vacuum-bot',
    label: 'Full Mix',
    file: 'https://res.cloudinary.com/donxjonx/video/upload/f_auto,q_auto/v1773067182/marcbedd/audio/vacuumbot/Vacuubot_vs_Human_LDR_mix2_bjsvng.mp3',
  },
];
const LDR_FROST_STEMS: Stem[] = [
  {
    id: 'LDR-Frost',
    label: 'Full Mix',
    file: 'https://res.cloudinary.com/donxjonx/video/upload/f_auto,q_auto/v1773067188/marcbedd/audio/frost/Frost_Whale_Run_audio_1_minute_hpdroe.mp3',
  },
];
const LDR_IKRAN_STEMS: Stem[] = [
  {
    id: 'avatar-ikran',
    label: 'Full Mix',
    file: 'https://res.cloudinary.com/donxjonx/video/upload/f_auto,q_auto/v1773067188/marcbedd/audio/ikran/ONE_MINUTE_IKRAN_sound_design_music_2_o1yekf.mp3',
  },
];
const BO6_STEMS: Stem[] = [
  {
    id: 'bo6-trailer',
    label: 'Full Mix',
    file: 'https://res.cloudinary.com/donxjonx/video/upload/f_auto,q_auto/v1773067189/marcbedd/audio/BO6/trailer_call_of_duty_audio_2_xpe3oo.mp3',
  },
];

const DEMO_PLAYLIST: PlaylistItem[] = [
  {
    id: 'avatar-take-1',
    title: 'Avatar – Thanator Chase',
    description:
      'Explore ambience, movement and creature roars in this sequence.',
    descriptionIt:
      'Esplora ambience, movimento e ruggiti della creatura in questa sequenza.',
    videoSrc:
      'https://res.cloudinary.com/donxjonx/video/upload/v1773066811/marcbedd/video/avatar/THANATOR_NO_AUDIO_ibhnxd.mp4',
    stems: AVATAR_STEMS,
  },
  {
    id: 'vacuumbot',
    title: 'Love, Death & Robots – Vacuum Bot',
    description: 'Separate stems available on request.',
    descriptionIt: 'Stem separati disponibili su richiesta.',
    videoSrc:
      'https://res.cloudinary.com/donxjonx/video/upload/v1773066807/marcbedd/video/vacuumbot/VACUUBOT_NO_AUDIO_vvcw6i.mp4',
    stems: LDR_VACUUM_STEMS,
  },
  {
    id: 'frost',
    title: 'Love, Death & Robots – Frost',
    description: 'Separate stems available on request.',
    descriptionIt: 'Stem separati disponibili su richiesta.',
    videoSrc:
      'https://res.cloudinary.com/donxjonx/video/upload/v1773066822/marcbedd/video/frost/FROST_NO_AUDIO_e4enii.mp4',
    stems: LDR_FROST_STEMS,
  },
  {
    id: 'ikran',
    title: 'Avatar – Ikran',
    description: 'Separate stems available on request.',
    descriptionIt: 'Stem separati disponibili su richiesta.',
    videoSrc:
      'https://res.cloudinary.com/donxjonx/video/upload/v1773066845/marcbedd/video/ikran/IKRAN_NO_AUDIO_tzyvp7.mp4',
    stems: LDR_IKRAN_STEMS,
  },
  {
    id: 'bo6-trailer',
    title: 'Black Ops 6 – Trailer',
    description: 'Separate stems available on request.',
    descriptionIt: 'Stem separati disponibili su richiesta.',
    videoSrc:
      'https://res.cloudinary.com/donxjonx/video/upload/v1773066836/marcbedd/video/BO6/BO6_TRAILER_NO_AUDIO_vgzycc.mp4',
    stems: BO6_STEMS,
  },
];

const buildStemState = (stems: Stem[]): Record<string, StemState> => {
  const map: Record<string, StemState> = {};
  for (const s of stems) map[s.id] = { volume: 1, muted: false };
  return map;
};

const InteractivePlayer: React.FC = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const accentClass = isDark ? 'text-amber-400' : 'text-orange-600';

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = useMemo(
    () => DEMO_PLAYLIST[currentIndex],
    [currentIndex],
  );
  const [stemState, setStemState] = useState<Record<string, StemState>>(() =>
    buildStemState(currentItem.stems),
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const isSeekingRef = useRef(false);
  const autoPlayOnLoadRef = useRef(false);

  const {
    isLoading,
    isUnlocked,
    loadStems,
    unlock,
    transportPlay,
    transportPause,
    transportStop,
    transportSeek,
    setStemVolume,
    setStemMuted,
  } = useTonePlayer();

  useEffect(() => {
    void loadStems(currentItem.id, currentItem.stems, stemState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem.id]);

  const startRaf = useCallback(() => {
    const loop = () => {
      const video = videoRef.current;
      if (video && !isSeekingRef.current) {
        const tSec = Tone.getTransport().seconds;
        if (Math.abs(video.currentTime - tSec) > 0.08) video.currentTime = tSec;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(loop);
  }, []);

  const stopRaf = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
  }, []);

  useEffect(() => () => stopRaf(), [stopRaf]);

  useEffect(() => {
    if (!isLoading && autoPlayOnLoadRef.current) {
      autoPlayOnLoadRef.current = false;
      const video = videoRef.current;
      if (!video) return;
      void video.play().catch(() => {});
      transportPlay(0);
      startRaf();
    }
  }, [isLoading, transportPlay, startRaf]);

  const handleStartExperience = useCallback(async () => {
    await unlock();
    const video = videoRef.current;
    if (!video) return;
    await video.play().catch(() => {});
    transportPlay(video.currentTime);
    startRaf();
  }, [unlock, transportPlay, startRaf]);

  const handlePlay = useCallback(() => {
    if (!isUnlocked) {
      void unlock().then(() => {
        const video = videoRef.current;
        if (!video) return;
        transportPlay(video.currentTime);
        startRaf();
      });
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    transportPlay(video.currentTime);
    startRaf();
  }, [isUnlocked, unlock, transportPlay, startRaf]);

  const handlePause = useCallback(() => {
    transportPause();
    stopRaf();
  }, [transportPause, stopRaf]);
  const handleSeeking = useCallback(() => {
    isSeekingRef.current = true;
  }, []);
  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    if (video) transportSeek(video.currentTime);
  }, [transportSeek]);
  const handleTimeUpdate = useCallback(() => {}, []);
  const handleRateChange = useCallback(() => {
    const video = videoRef.current;
    if (video && video.playbackRate !== 1) video.playbackRate = 1;
  }, []);

  const handleSelectItem = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      stopRaf();
      transportStop();
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      if (isUnlocked) autoPlayOnLoadRef.current = true;
      setStemState(buildStemState(DEMO_PLAYLIST[index].stems));
      setCurrentIndex(index);
    },
    [currentIndex, isUnlocked, transportStop, stopRaf],
  );

  const handleToggleMute = useCallback(
    (stemId: string) => {
      setStemState((prev) => {
        const muted = !prev[stemId]?.muted;
        setStemMuted(stemId, muted);
        return {
          ...prev,
          [stemId]: { volume: prev[stemId]?.volume ?? 1, muted },
        };
      });
    },
    [setStemMuted],
  );

  const handleChangeVolume = useCallback(
    (stemId: string, volume: number) => {
      const muted = volume === 0;
      setStemVolume(stemId, volume);
      setStemMuted(stemId, muted);
      setStemState((prev) => ({ ...prev, [stemId]: { volume, muted } }));
    },
    [setStemVolume, setStemMuted],
  );

  return (
    <section className='relative mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-2xl bg-card/80 p-4 shadow-lg ring-1 ring-border md:p-6 lg:flex-row'>
      <div className='flex min-w-0 flex-1 flex-col gap-4'>
        <VideoDisplay
          key={currentIndex}
          ref={videoRef}
          src={currentItem.videoSrc}
          title={currentItem.title}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onSeeking={handleSeeking}
          onSeeked={handleSeeked}
          onRateChange={handleRateChange}
        />
        {isLoading ? (
          <div className='flex items-center gap-2.5 rounded-2xl border border-border/70 bg-background/80 p-4 text-xs text-muted-foreground'>
            <Loader2 className='h-3.5 w-3.5 animate-spin' />
            {language === 'it' ? 'Caricamento audio…' : 'Loading audio…'}
          </div>
        ) : (
          <MixerPanel
            stems={currentItem.stems}
            stemState={stemState}
            onToggleMute={handleToggleMute}
            onChangeVolume={handleChangeVolume}
          />
        )}
      </div>

      <aside className='mt-2 w-full border-t border-border/70 pt-4 lg:mt-0 lg:w-80 lg:border-l lg:border-t-0 lg:pl-4'>
        <h2
          className={[
            'mb-2 text-xs font-semibold uppercase tracking-[0.16em]',
            accentClass,
          ].join(' ')}
        >
          {language === 'it' ? 'Selezione lavori' : 'Selected work'}
        </h2>
        <div className='flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0'>
          {DEMO_PLAYLIST.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={item.id}
                type='button'
                onClick={() => handleSelectItem(index)}
                className={[
                  'flex w-55 shrink-0 flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left text-sm transition lg:w-auto lg:shrink',
                  isActive
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border/70 bg-background/60 hover:border-primary/40 hover:bg-muted/70',
                ].join(' ')}
              >
                <span className='text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={['font-medium', isActive ? accentClass : ''].join(
                    ' ',
                  )}
                >
                  {item.title}
                </span>
                {item.description ? (
                  <span className='line-clamp-2 text-xs text-muted-foreground'>
                    {language === 'it'
                      ? (item.descriptionIt ?? item.description)
                      : item.description}
                  </span>
                ) : null}
                <div className='mt-1 flex flex-wrap gap-1.5'>
                  {item.stems.map((stem) => (
                    <span
                      key={stem.id}
                      className='rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground'
                    >
                      {stem.label}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {!isUnlocked && (
        <div
          role='button'
          tabIndex={0}
          aria-label={language === 'it' ? 'Avvia audio' : 'Start audio'}
          className='absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-black/65 backdrop-blur-sm'
          onClick={handleStartExperience}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ')
              void handleStartExperience();
          }}
        >
          <div className='rounded-full bg-white/10 p-5 ring-1 ring-white/25 transition hover:bg-white/20'>
            <Play className='h-10 w-10 fill-white text-white' />
          </div>
          <div className='text-center'>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-white'>
              {language === 'it' ? 'Avvia audio' : 'Start audio'}
            </p>
            <p className='mt-1 text-[11px] text-white/50'>
              {language === 'it'
                ? 'Tocca per abilitare la riproduzione'
                : 'Tap to enable playback'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default InteractivePlayer;
