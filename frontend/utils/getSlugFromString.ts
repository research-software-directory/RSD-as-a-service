
/**
 * Create slug from title string.
 * Based on gist code
 * https://gist.github.com/codeguy/6684588
 * @param title
 */
export function getSlugFromString(title: string, separator:string='-') {
  if (!title) return ''
  return title
    // split an accented letter in the base letter and the acent
    .normalize('NFKD')
    // remove all previously split accents
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    // .replace(/[^\w\s-]/g, '')
    // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/[-\s]+/g, separator)
}

export function sanitizeSlugValue(slug: string, separator: string = '-') {
  if (!slug) return ''
  return slug
    // split an accented letter in the base letter and the acent
    .normalize('NFKD')
    // remove all previously split accents
    // .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    // .replace(/[^\w\s-]/g, '')
    // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/[^a-z0-9\-]/g, '')
    .trim()
    .replace(/[-\s]+/g, separator)
}
