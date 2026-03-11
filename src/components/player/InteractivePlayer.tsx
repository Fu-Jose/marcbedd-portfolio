import React, { useEffect, useMemo, useRef, useState } from 'react';
import VideoDisplay from './VideoDisplay';
import MixerPanel from './MixerPanel';
import { useLanguage } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';

type Stem = {
  id: string;
  label: string;
  file: string;
};

type PlaylistItem = {
  id: string;
  title: string;
  description?: string;
  descriptionIt?: string;
  videoSrc: string;
  stems: Stem[];
};

type StemState = {
  volume: number;
  muted: boolean;
};

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
    title: 'Black Ops 6 - Trailer',
    description: 'Separate stems available on request.',
    descriptionIt: 'Stem separati disponibili su richiesta.',
    videoSrc:
      'https://res.cloudinary.com/donxjonx/video/upload/v1773066836/marcbedd/video/BO6/BO6_TRAILER_NO_AUDIO_vgzycc.mp4',
    stems: BO6_STEMS,
  },
];

const buildInitialStemState = (
  playlist: PlaylistItem[],
): Record<string, StemState> => {
  const map: Record<string, StemState> = {};
  for (const item of playlist) {
    for (const stem of item.stems) {
      if (!map[stem.id]) {
        map[stem.id] = { volume: 1, muted: false };
      }
    }
  }
  return map;
};

const InteractivePlayer: React.FC = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const accentClass = isDark ? 'text-amber-400' : 'text-orange-600';
  const [playlist] = useState<PlaylistItem[]>(DEMO_PLAYLIST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stemState, setStemState] = useState<Record<string, StemState>>(() =>
    buildInitialStemState(DEMO_PLAYLIST),
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const currentItem = useMemo(
    () => playlist[currentIndex],
    [playlist, currentIndex],
  );

  useEffect(() => {
    Object.entries(stemState).forEach(([stemId, state]) => {
      const audio = audioRefs.current[stemId];
      if (!audio) return;
      audio.volume = state.muted ? 0 : state.volume;
    });
  }, [stemState]);

  const handleSelectItem = (index: number) => {
    const video = videoRef.current;

    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    if (video) {
      const shouldAutoplay = !video.paused;
      video.pause();
      video.currentTime = 0;
      setCurrentIndex(index);

      window.setTimeout(() => {
        if (!videoRef.current) return;
        if (shouldAutoplay) {
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } else {
      setCurrentIndex(index);
    }
  };

  const syncAudioToVideoTime = () => {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;
    Object.values(audioRefs.current).forEach((audio) => {
      if (!audio) return;
      const diff = Math.abs(audio.currentTime - t);
      if (diff > 0.1) {
        audio.currentTime = t;
      }
    });
  };

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;
    Object.values(audioRefs.current).forEach((audio) => {
      if (!audio) return;
      audio.currentTime = t;
      audio.playbackRate = video.playbackRate;
      audio.play().catch(() => {});
    });
  };

  const handlePause = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (!audio) return;
      audio.pause();
    });
  };

  const handleTimeUpdate = () => {
    syncAudioToVideoTime();
  };

  const handleSeeking = () => {
    syncAudioToVideoTime();
  };

  const handleSeeked = () => {
    syncAudioToVideoTime();
  };

  const handleRateChange = () => {
    const video = videoRef.current;
    if (!video) return;
    Object.values(audioRefs.current).forEach((audio) => {
      if (!audio) return;
      audio.playbackRate = video.playbackRate;
    });
  };

  const handleToggleMute = (stemId: string) => {
    setStemState((prev) => ({
      ...prev,
      [stemId]: {
        volume: prev[stemId]?.volume ?? 1,
        muted: !prev[stemId]?.muted,
      },
    }));
  };

  const handleChangeVolume = (stemId: string, volume: number) => {
    setStemState((prev) => ({
      ...prev,
      [stemId]: {
        volume,
        muted: volume === 0 ? true : (prev[stemId]?.muted ?? false),
      },
    }));
  };

  return (
    <section className='mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-2xl bg-card/80 p-4 shadow-lg ring-1 ring-border md:p-6 lg:flex-row'>
      <div className='flex min-w-0 flex-1 flex-col gap-4'>
        <VideoDisplay
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

        <MixerPanel
          stems={currentItem.stems}
          stemState={stemState}
          onToggleMute={handleToggleMute}
          onChangeVolume={handleChangeVolume}
        />
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
          {playlist.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={item.id}
                type='button'
                onClick={() => handleSelectItem(index)}
                className={[
                  'flex w-[220px] flex-shrink-0 flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left text-sm transition lg:w-auto lg:flex-shrink',
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

      {currentItem.stems.map((stem) => (
        <audio
          key={stem.id}
          ref={(el) => {
            audioRefs.current[stem.id] = el;
            if (el) {
              const state = stemState[stem.id];
              el.volume = state?.muted ? 0 : (state?.volume ?? 1);
            }
          }}
          src={stem.file}
          preload='auto'
        />
      ))}
    </section>
  );
};

export default InteractivePlayer;
