// Converts a title string into a URL-safe slug.
// e.g. "Pengumuman Wisuda 2026!" -> "pengumuman-wisuda-2026"
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
