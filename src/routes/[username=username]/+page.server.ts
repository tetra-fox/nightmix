import { error as svelteError } from "@sveltejs/kit";
import { supabase } from "$lib/supabase/client";
import type { PageServerLoad } from "./$types";
import { pathnameSplit } from "$lib/utils";

export const load: PageServerLoad = (async ({ fetch, params, url, locals }) => {
  const { username } = params;
  const { data, error } = await supabase.from("artists").select().eq("username", username).single();

  if (error) throw svelteError(500, { message: error.message });
  if (!data) throw svelteError(404, { message: "User not found" });
}) satisfies PageServerLoad;
