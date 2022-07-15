import {useEffect, useState} from 'react'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type MarkdownPage = {
  id?: string
  slug?: string
  title?: string
  description?: string
  is_published?: boolean
  position?: number
}

type UseMarkdownpageProps = {
  slug: string,
  published?: boolean
  frontend?: boolean
  token?: string
}

export async function ssrMarkdownPage(slug: string) {
  // get about page if exists and is published
  const {page} = await fetchMarkdownPage({
    slug,
    published: true,
    frontend: false
  })
  if (page === null) {
    // 404 if no page returned
    return {
      notFound: true,
    }
  }
  // will be passed as props to page
  // see params of SoftwareIndexPage function
  return {
    props: {
      title: page?.title,
      markdown: page.description ?? '# 404 - not found'
    },
  }
}

export async function fetchMarkdownPage(props:UseMarkdownpageProps) {
  try {
    const {slug, token, frontend,published} = props
    let query = `meta_pages?slug=eq.${slug}`
    if (published) {
      // only published
      query+='&is_published=eq.true'
    }
    let url = `/api/v1/${query}`
    if (frontend === false) {
      url = `${process.env.POSTGREST_URL}/${query}`
    }
    // get page
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        'Accept': 'application/vnd.pgrst.object + json',
      }
    })

    if (resp.status === 200) {
      const json:MarkdownPage = await resp.json()
      return {
        page: json,
        error: null
      }
    } else if ([404, 406].includes(resp.status) === true) {
      // page not found
      return {
        page: null,
        error: `${resp?.status} ${resp.statusText}`
      }
    }
    // log error
    logger(`fetchMarkdownPage failed: ${resp?.status} ${resp.statusText}`, 'warn')
    return {
      page: null,
      error: `${resp?.status} ${resp.statusText}`
    }
  } catch (e:any) {
    logger(`fetchMarkdownPage: ${e?.message}`, 'error')
    return {
      page: null,
      error: e?.message
    }
  }
}

export async function getPublishedMarkdownPages(frontend:boolean=true) {
  try {
    let query = 'meta_pages?is_published=eq.true&order=position'
    let url = `/api/v1/${query}`
    if (frontend === false) {
      url = `${process.env.POSTGREST_URL}/${query}`
    }
    // get page
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(undefined)
      }
    })

    if (resp.status === 200) {
      const json:MarkdownPage[] = await resp.json()
      return json.map(item => {
        return {title: item.title, slug: item.slug}
      })
    }

    logger(`getPublishedMarkdownPages failed: ${resp?.status} ${resp.statusText}`, 'error')
    return []

  } catch (e: any) {
    logger(`getPublishedMarkdownPages: ${e?.message}`, 'error')
    return []
  }
}

export function useMarkdownPage({slug,token,published,frontend}:UseMarkdownpageProps) {
  const [page, setPage] = useState<MarkdownPage>()
  const [loading, setLoading] = useState(true)
  // debugger
  useEffect(() => {
    async function getMarkdownPage() {
      setLoading(true)
      const resp = await fetchMarkdownPage({slug,token})
      if (resp.page) {
        setPage(resp.page)
      } else {
        setPage(undefined)
      }
      setLoading(false)
    }
    if (slug) {
      getMarkdownPage()
    }
  }, [slug,token])

  return {loading, page}
}
