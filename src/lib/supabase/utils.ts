import { supabase } from "./client";

export async function updateUrls(data: any[], urlKeys: string[]): Promise<any[]> {
  const BUCKET_URL_MATCHER = /^([a-z]+):([a-z0-9/._-]+)$/i;

  const urls = data
    .filter((item) => urlKeys.some((key) => BUCKET_URL_MATCHER.test(item[key])))
    .map((item) => {
      const urlKey = urlKeys.find((key) => BUCKET_URL_MATCHER.test(item[key]));
      const url = item[urlKey];
      const [, bucket, path] = url.match(BUCKET_URL_MATCHER) || [];
      return { urlKey, bucket, path };
    });

  const signedUrls = await Promise.all(
    urls.map(({ urlKey, bucket, path }) => {
      return supabase.storage.from(bucket).createSignedUrl(path, 60);
    })
  );

  signedUrls.forEach((signedUrl, index) => {
    const { urlKey, bucket, path } = urls[index];
    const item = data.find((item) => item[urlKey].endsWith(`:${bucket}/${path}`));
    if (item) item[urlKey] = signedUrl;
  });

  return data;
}

export async function getPublicUrls(data: any[], urlKeys: string[]): Promise<any[]> {
  const BUCKET_URL_MATCHER = /^([a-z]+):([a-z0-9/._-]+)$/i;

  const urls = data
    .filter((item) => urlKeys.some((key) => BUCKET_URL_MATCHER.test(item[key])))
    .map((item) => {
      const urlKey = urlKeys.find((key) => BUCKET_URL_MATCHER.test(item[key]));
      const url = item[urlKey];
      const [, bucket, path] = url.match(BUCKET_URL_MATCHER) || [];
      return { urlKey, bucket, path };
    });

  const signedUrls = await Promise.all(
    urls.map(({ urlKey, bucket, path }) => {
      return supabase.storage.from(bucket).createSignedUrl(path, 60);
    })
  );

  signedUrls.forEach((signedUrl, index) => {
    const { urlKey, bucket, path } = urls[index];
    const item = data.find((item) => item[urlKey].endsWith(`:${bucket}/${path}`));
    if (item) item[urlKey] = signedUrl;
  });

  return data;
}
