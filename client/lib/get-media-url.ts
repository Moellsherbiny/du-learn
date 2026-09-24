export function getMediaUrl(path?: string | null) {
  if (!path) return undefined;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) return path;

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}