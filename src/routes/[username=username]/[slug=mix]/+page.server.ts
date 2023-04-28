import { error } from "@sveltejs/kit";
import { supabase } from "$lib/supabase/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = (async ({ params, url, locals }) => {
  const { username, slug } = params;
  const { data: mix } = await supabase
    .from("mixes")
    .select(
      `
        *,
        artists (
          name
        ),
        timestamps (
          timestamp_ms,
          timestamp,
          artist,
          title
        )
      `
    )
    .eq("slug", slug)
    .eq("artists.username", username)
    .single();

  return {
    mix: mix ?? [],
  };
}) satisfies PageServerLoad;
