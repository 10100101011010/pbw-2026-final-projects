export function readingTime(text = '') {

  const words = text.trim().split(/\s+/).length

  const minutes = Math.max(
    1,
    Math.ceil(words / 200)
  )

  return `${minutes} min read`
}