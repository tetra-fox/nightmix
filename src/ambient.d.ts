interface PlayerState {
  currentTrack: Database["public"]["Tables"]["mixes"]["Row"] | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Database["public"]["Tables"]["mixes"]["Row"][];
  repeat: RepeatMode;
}

interface UserSettings {
  darkMode: boolean;
}
