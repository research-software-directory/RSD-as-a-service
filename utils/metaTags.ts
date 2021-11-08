
type OgMeta={
  url:string,
  title:string,
  description:string,
  imageUrl:string
}

export function ogMeta (data:OgMeta) {
  return [
    { hid: 'og:type', property: 'og:type', content: 'website' },
    { hid: 'og:url', property: 'og:url', content: data.url },
    { hid: 'og:title', property: 'og:title', content: data.title },
    { hid: 'og:description', property: 'og:description', content: data.description },
    { hid: 'og:image', property: 'og:image', content: data.imageUrl },
    { hid: 'og:image:width', property: 'og:image:width', content: '740' },
    { hid: 'og:image:height', property: 'og:image:height', content: '300' }
  ]
}

type TwitterMeta={
  user: string,
  url: string,
  title:string,
  description:string,
  imageUrl:string
}

export function twitterMeta (data:TwitterMeta) {
  return [
    { hid: 'twitter:site', name: 'twitter:site', content: data.user },
    { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
    { hid: 'twitter:url', name: 'twitter:url', content: data.url },
    { hid: 'twitter:title', name: 'twitter:title', content: data.title },
    { hid: 'twitter:description', name: 'twitter:description', content: data.description },
    { hid: 'twitter:image', name: 'twitter:image', content: data.imageUrl }
  ]
}

export function canonicalUrl () {
  if (typeof window !== 'undefined') {
    // debugger
    // check if this might be missed by crawler because it's added on the client side
    return { hid: 'canonical', rel: 'canonical', href: location?.href }
  } else {
    // return baseUrl as canonical?
    return { hid: 'canonical', rel: 'canonical', href: 'https://www.research-software.nl' }
  }
}

type CitationMeta={
  title:string,
  author:string,
  publicationDate:string,
  doi:string,
}

export function citationMeta (data:CitationMeta) {
  return [
    { hid: 'citation_title', name: 'citation_title', content: data.title },
    { hid: 'citation_author', name: 'citation_author', content: data.author ?? 'unknown' },
    { hid: 'citation_publication_date', name: 'citation_publication_date', content: data.publicationDate ?? 'unknown' },
    { hid: 'citation_doi', name: 'citation_doi', content: data.doi ?? 'unknown' }
  ]
}
