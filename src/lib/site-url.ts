export function getPublicSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1") return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}
