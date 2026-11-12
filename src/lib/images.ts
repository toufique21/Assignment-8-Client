const IMGBB_HOSTS = new Set([
  "ibb.co",
  "www.ibb.co",
  "ibb.co.com",
  "www.ibb.co.com",
  "imgbb.com",
  "www.imgbb.com",
]);

// ImgBB viewer pages look like https://ibb.co.com/<id>
const IMGBB_PAGE_PATH = /^\/([A-Za-z0-9]{4,20})\/?$/;

/** Returns the ImgBB image id when `value` is a viewer page link, otherwise null. */
export const getImgbbImageId = (value: string) => {
  try {
    const url = new URL(value.trim());

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!IMGBB_HOSTS.has(url.hostname.toLowerCase())) return null;

    return url.pathname.match(IMGBB_PAGE_PATH)?.[1] ?? null;
  } catch {
    return null;
  }
};

/**
 * Turns an image link into something a browser can render.
 *
 * Users often paste the ImgBB viewer page link (https://ibb.co.com/xxxx) instead of
 * the direct file link, so those are routed through /api/image, which resolves the
 * real image URL from ImgBB's oEmbed endpoint. Direct links are returned untouched.
 */
export const getCoverSrc = (value?: string) => {
  const trimmed = value?.trim();

  if (!trimmed) return undefined;

  if (getImgbbImageId(trimmed)) {
    return `/api/image?url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
};
