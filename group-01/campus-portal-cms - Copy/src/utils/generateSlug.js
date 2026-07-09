import { slugify } from './slugify.js'

export function generateSlug(title) {

  return `${slugify(title)}-${Date.now()}`

}