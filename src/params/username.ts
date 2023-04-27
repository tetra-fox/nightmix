import { supabase } from "$lib/supabase/client";

export const match = async (value: string) => {
  const { data, error } = await supabase.from("artists").select().eq("username", value).single();
  if (error) return false;
  return !!data;
};
