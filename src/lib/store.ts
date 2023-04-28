import { writable } from "svelte/store";
import type { Database } from "$lib/supabase/types";

const createPlayerState = () => {
  const { subscribe, set, update } = writable<AudioStore>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.75,
    queue: [],
  });

  return {
    subscribe,
    set,
    play: () => update((state) => ({ ...state, isPlaying: true })),
    setTrack: (metadata: Database["public"]["Tables"]["mixes"]["Row"]) =>
      update((state) => ({ ...state, currentTrack: metadata })),
    setVolume: (newVolume: number) => update((state) => ({ ...state, volume: newVolume })),
    setDuration: (newDuration: number) => update((state) => ({ ...state, duration: newDuration })),
    pause: () => update((state) => ({ ...state, isPlaying: false })),
    queueNext(track: Database["public"]["Tables"]["mixes"]["Row"]) {
      update((state) => ({ ...state, queue: [...state.queue, track] }));
    },
    queueLast(track: Database["public"]["Tables"]["mixes"]["Row"]) {
      update((state) => ({ ...state, queue: [track, ...state.queue] }));
    },
    toggleTransport: () => update((state) => ({ ...state, isPlaying: !state.isPlaying })),
    seek: (newTime: number) => update((state) => ({ ...state, currentTime: newTime })),
    reset: () =>
      set({
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.75,
        queue: [],
      }),
  };
};

export const playerState = createPlayerState();
