
export function maxText({text, maxLen = 100, dots=true}:
  { text: string, maxLen?: number, dots?: boolean}) {
  try {
    // return complete content if smaller than max
    if (text.length < maxLen) return text
    const returnText = text.slice(0, maxLen)
    if (dots) {
      return `${returnText}...`
    }
    return returnText
  } catch (e) {
    // on error return received
    return text
  }
}
