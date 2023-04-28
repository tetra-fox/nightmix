import { writable } from "svelte/store";
import type { Database } from "$lib/supabase/types";

const createPlayerState = () => {
  const { subscribe, set, update } = writable<AudioStore>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.5,
  });

  return {
    subscribe,
    play: () => update((state) => ({ ...state, isPlaying: true })),
    setTrack: (metadata: Database["public"]["Tables"]["mixes"]["Row"]) =>
      update((state) => ({ ...state, currentTrack: metadata })),
    setVolume: (newVolume: number) => update((state) => ({ ...state, volume: newVolume })),
    pause: () => update((state) => ({ ...state, isPlaying: false })),
    seek: (newTime: number) => update((state) => ({ ...state, currentTime: newTime })),
    stop: () => update((state) => ({ ...state, isPlaying: false, currentTime: 0 })),
    reset: () =>
      set({
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.5,
      }),
  };
};

export const playerState = createPlayerState();
