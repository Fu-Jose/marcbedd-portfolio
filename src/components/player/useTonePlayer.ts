/**
 * useTonePlayer
 *
 * Manages a set of Tone.js Players (one per stem) routed through individual
 * Channels, all locked to a shared Transport.
 *
 * Solves mobile-specific issues:
 *  - iOS AudioContext lock: exposes `unlock()` that must be called from a
 *    direct user-gesture handler (tap/click).
 *  - Sample-accurate sync: all Players are `.sync().start(0)` — the Transport
 *    is the single master clock.
 *  - Memory safety: disposes every Tone node on track-switch and on unmount.
 *  - Mobile smoothness: `latencyHint: 'playback'` context for larger buffers.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

export type ToneStem = {
  id: string;
  label: string;
  file: string;
};

export type ToneStemState = {
  volume: number; // 0–1 linear
  muted: boolean;
};

/** One-time context initialization with playback latency hint */
let toneContextReady = false;
function ensureToneContext() {
  if (toneContextReady || typeof window === 'undefined') return;
  toneContextReady = true;
  try {
    // 'playback' = larger audio buffer → less crackling on mobile
    Tone.setContext(new Tone.Context({ latencyHint: 'playback' }));
  } catch {
    // Context already exists — ignore
  }
}

export function useTonePlayer() {
  const playersRef = useRef<Map<string, Tone.Player>>(new Map());
  const channelsRef = useRef<Map<string, Tone.Channel>>(new Map());
  const loadedItemIdRef = useRef<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // ─── Dispose ───────────────────────────────────────────────────────────────

  const disposeAll = useCallback(() => {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();

    for (const p of playersRef.current.values()) {
      try {
        p.stop();
        p.unsync();
        p.dispose();
      } catch {
        /* already gone */
      }
    }
    for (const c of channelsRef.current.values()) {
      try {
        c.dispose();
      } catch {
        /* already gone */
      }
    }

    playersRef.current.clear();
    channelsRef.current.clear();
    loadedItemIdRef.current = null;
  }, []);

  // ─── Load ──────────────────────────────────────────────────────────────────

  /**
   * Loads a new set of stems into Tone.Players.
   * No-op if the same itemId is already loaded.
   * Previous nodes are disposed before loading new ones.
   */
  const loadStems = useCallback(
    async (
      itemId: string,
      stems: ToneStem[],
      initState: Record<string, ToneStemState>,
    ) => {
      if (loadedItemIdRef.current === itemId) return;
      disposeAll();
      ensureToneContext();
      setIsLoading(true);

      for (const stem of stems) {
        const state = initState[stem.id] ?? { volume: 1, muted: false };
        const gainDb =
          state.volume <= 0 ? -Infinity : Tone.gainToDb(state.volume);

        const channel = new Tone.Channel({
          volume: gainDb,
          mute: state.muted,
        }).toDestination();

        // sync().start(0): player starts at Transport time 0;
        // seeking Transport to t=N will play audio from N seconds in.
        const player = new Tone.Player(stem.file)
          .connect(channel)
          .sync()
          .start(0);

        player.loop = false;
        playersRef.current.set(stem.id, player);
        channelsRef.current.set(stem.id, channel);
      }

      try {
        await Tone.loaded();
      } catch {
        // Network error — continue anyway
      }

      loadedItemIdRef.current = itemId;
      setIsLoading(false);
    },
    [disposeAll],
  );

  // ─── AudioContext unlock ────────────────────────────────────────────────────

  /**
   * MUST be called synchronously inside a user-gesture handler (tap/click).
   * Resumes the suspended WebAudio context — required on iOS / Android.
   */
  const unlock = useCallback(async () => {
    ensureToneContext();
    try {
      await Tone.start();
    } catch {
      /* ignore */
    }
    setIsUnlocked(true);
  }, []);

  // ─── Transport controls ────────────────────────────────────────────────────

  const transportPlay = useCallback((fromSeconds: number) => {
    const t = Tone.getTransport();
    t.seconds = fromSeconds;
    t.start();
  }, []);

  const transportPause = useCallback(() => {
    Tone.getTransport().pause();
  }, []);

  const transportStop = useCallback(() => {
    Tone.getTransport().stop();
  }, []);

  const transportSeek = useCallback((seconds: number) => {
    Tone.getTransport().seconds = seconds;
  }, []);

  // ─── Per-stem controls ─────────────────────────────────────────────────────

  const setStemVolume = useCallback((stemId: string, linearVolume: number) => {
    const channel = channelsRef.current.get(stemId);
    if (!channel) return;
    channel.volume.value =
      linearVolume <= 0 ? -Infinity : Tone.gainToDb(linearVolume);
  }, []);

  const setStemMuted = useCallback((stemId: string, muted: boolean) => {
    const ch = channelsRef.current.get(stemId);
    if (!ch) return;
    ch.mute = muted;
  }, []);

  // ─── Cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      disposeAll();
    };
  }, [disposeAll]);

  return {
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
  } as const;
}
