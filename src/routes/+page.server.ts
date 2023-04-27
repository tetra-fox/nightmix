import { supabase } from "$lib/supabase/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = (async ({ url, locals }) => {
  const { data: mixes, error: mixesError } = await supabase
    .from("mixes")
    .select(
      `
      *,
      artists (name, username),
      timestamps (timestamp_ms, artist, title)
    `
    )
    .order("created_at", { ascending: false });

  if (!mixes || mixesError) return { status: 404 };

  const BUCKET_URL_MATCHER = /^([a-z]+):([a-z0-9/._-]+)$/i;

  // create a map of artwork urls to empty strings
  const artworkUrls = mixes
    .filter((obj) => BUCKET_URL_MATCHER.test(obj.artwork_url))
    .map((obj) => obj.artwork_url);

  const bucketPaths = artworkUrls.map((url) => url.split(":")[1]);

  // get short-lived urls from supabase
  const { data: artworkSignedUrls, error: artworkError } = await supabase.storage
    .from("images")
    .createSignedUrls(bucketPaths, 60); // 60 seconds

  if (!artworkSignedUrls || artworkError) return { status: 404 };

  for (const url of artworkUrls) {
    const mix = mixes?.find(({ artwork_url }) => artwork_url === url);
    const { signedUrl } = artworkSignedUrls?.find(({ path }) => path === url.split(":")[1]) || {};
    if (mix && signedUrl) mix.artwork_url = signedUrl;
  }

  return {
    mixes: mixes,
  };
}) satisfies PageServerLoad;
