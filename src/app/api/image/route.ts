import { getImgbbImageId } from "@/lib/images";

const asImageUrl = (value: unknown) => {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

/**
 * Resolves an ImgBB viewer page link (https://ibb.co.com/<id>) to the direct image
 * file, then redirects to it. Used by getCoverSrc() so pasted page links still render.
 */
export async function GET(request: Request) {
  const source = new URL(request.url).searchParams.get("url");

  if (!source) {
    return Response.json({ error: "A url query parameter is required." }, { status: 400 });
  }

  const imageId = getImgbbImageId(source);

  if (!imageId) {
    return Response.json(
      { error: "Only ImgBB image page links can be resolved." },
      { status: 400 },
    );
  }

  const oembedUrl = `${new URL(source).origin}/${imageId}/oembed.json`;

  try {
    const response = await fetch(oembedUrl, {
      headers: {
        accept: "application/json",
        "user-agent": "Mozilla/5.0 (compatible; BookNook/1.0)",
      },
    });

    if (!response.ok) {
      return Response.json({ error: "Could not resolve that ImgBB link." }, { status: 502 });
    }

    const data = (await response.json()) as { url?: unknown; thumbnail_url?: unknown };
    const imageUrl = asImageUrl(data.url) ?? asImageUrl(data.thumbnail_url);

    if (!imageUrl) {
      return Response.json(
        { error: "That ImgBB link does not point to an image." },
        { status: 404 },
      );
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: imageUrl,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return Response.json({ error: "Could not resolve that ImgBB link." }, { status: 502 });
  }
}
