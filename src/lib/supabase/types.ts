export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: number;
          name: string;
          username: string;
        };
        Insert: {
          id?: number;
          name: string;
          username: string;
        };
        Update: {
          id?: number;
          name?: string;
          username?: string;
        };
      };
      mixes: {
        Row: {
          artist_id: number;
          artwork_url: string;
          audio_url: string;
          created_at: string;
          description: string;
          id: number;
          slug: string;
          tags: string[];
          title: string;
        };
        Insert: {
          artist_id: number;
          artwork_url: string;
          audio_url: string;
          created_at?: string;
          description?: string;
          id?: number;
          slug: string;
          tags?: string[];
          title: string;
        };
        Update: {
          artist_id?: number;
          artwork_url?: string;
          audio_url?: string;
          created_at?: string;
          description?: string;
          id?: number;
          slug?: string;
          tags?: string[];
          title?: string;
        };
      };
      timestamps: {
        Row: {
          artist: string;
          id: number;
          mix_id: number;
          timestamp: string;
          timestamp_ms: number;
          title: string;
        };
        Insert: {
          artist: string;
          id?: number;
          mix_id: number;
          timestamp: string;
          timestamp_ms: number;
          title: string;
        };
        Update: {
          artist?: string;
          id?: number;
          mix_id?: number;
          timestamp?: string;
          timestamp_ms?: number;
          title?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
