import { createClient } from "@supabase/supabase-js";
import type { Database } from "$lib/supabase/types";

export const supabase = createClient<Database>(
  "https://gobwewbbmszqgbfvrsnl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvYndld2JibXN6cWdiZnZyc25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI0NjA0OTYsImV4cCI6MTk5ODAzNjQ5Nn0.PtcVWV5R9SOmEdaik-b5afxstqRBxyMMJ6wSuwMDLRM"
);
