import { writable } from "svelte/store";
import type { Database } from "$lib/supabase/types";

const createPlayerState = () => {
  const { subscribe, set, update } = writable<AudioStore>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.75,
  });

  return {
    subscribe,
    play: () => update((state) => ({ ...state, isPlaying: true })),
    setTrack: (metadata: Database["public"]["Tables"]["mixes"]["Row"]) =>
      update((state) => ({ ...state, currentTrack: metadata })),
    setVolume: (newVolume: number) => update((state) => ({ ...state, volume: newVolume })),
    setDuration: (newDuration: number) => update((state) => ({ ...state, duration: newDuration })),
    pause: () => update((state) => ({ ...state, isPlaying: false })),
    seek: (newTime: number) => update((state) => ({ ...state, currentTime: newTime })),
    reset: () =>
      set({
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.75,
      }),
  };
};

export const playerState = createPlayerState();
