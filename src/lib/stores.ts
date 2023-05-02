import { writable } from "svelte/store";
import type { Database } from "$lib/supabase/types";
import { RepeatMode } from "$lib/enums/repeatmode";

const createPlayerState = () => {
  const defaultState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.75,
    repeat: RepeatMode.None,
    queue: [],
  };

  const { subscribe, set, update } = writable<PlayerState>(defaultState);

  return {
    subscribe,
    set,
    play: () => update((state) => ({ ...state, isPlaying: true })),
    pause: () => update((state) => ({ ...state, isPlaying: false })),
    toggleTransport: () => update((state) => ({ ...state, isPlaying: !state.isPlaying })),
    setTrack: (metadata: Database["public"]["Tables"]["mixes"]["Row"]) =>
      update((state) => ({ ...state, currentTrack: metadata })),
    setVolume: (newVolume: number) => update((state) => ({ ...state, volume: newVolume })),
    setDuration: (newDuration: number) => update((state) => ({ ...state, duration: newDuration })),
    setRepeatMode: (newRepeatMode: RepeatMode) =>
      update((state) => ({ ...state, repeat: newRepeatMode })),
    cycleRepeatMode: () =>
      update((state) => ({
        ...state,
        repeat: (state.repeat + 1) % (Object.keys(RepeatMode).length / 2),
      })),
    queueNext(track: Database["public"]["Tables"]["mixes"]["Row"]) {
      update((state) => ({ ...state, queue: [...state.queue, track] }));
    },
    queueLast(track: Database["public"]["Tables"]["mixes"]["Row"]) {
      update((state) => ({ ...state, queue: [track, ...state.queue] }));
    },
    seek: (newTime: number) => update((state) => ({ ...state, currentTime: newTime })),
    reset: () => set(defaultState),
  };
};

export const playerState = createPlayerState();

export type PlayerStore = ReturnType<typeof createPlayerState>;

export const userSettings = writable<UserSettings>({
  darkMode: false,
});
