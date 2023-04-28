interface Mix {
  title: string;
  created_at: string; // ISO 8601 timestamp
  description: string;
  image_url: string; // absolute path
  audio_url: string; // absolute path
  tracklist: MixTrack[];
  artist_id: number;
}

interface MixTrack {
  artist: string;
  title: string;
  timestamp: string;
  timestamp_ms: number;
}

interface AudioStore {
  currentTrack: Database["public"]["Tables"]["mixes"]["Row"] | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}
