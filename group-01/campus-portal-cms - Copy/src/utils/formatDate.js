// Formats an ISO date string / Date object into a human-readable string.
// TODO: finalize desired locale/format once STYLEGUIDE.md is confirmed.
export function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
