import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {headers} from 'next/headers'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth/getSessionServerSide'
import {getImageUrl} from '~/utils/editImage'
import {createMetadata} from '~/components/seo/apiMetadata'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getNewsItemBySlug} from '~/components/news/apiNews'
import NewsItemHeader from '~/components/news/item/NewsItemHeader'
import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'
import NewsItemBreadcrumbs from '~/components/news/item/NewsItemBreadcrumbs'
import NewsItemMenu from '~/components/news/item/NewsItemMenu'


/**
 * Next.js app builtin function to dynamically create page metadata
 * @param param0
 * @returns
 */
export async function generateMetadata(
  {params}:{params: Promise<{slug: string, date:string}>}
): Promise<Metadata> {
  // read route params
  const [{slug,date},{token},headersList] = await Promise.all([
    params,
    getUserSettings(),
    headers()
  ])

  // find organisation by slug
  const newsItem = await getNewsItemBySlug({date, slug, token})

  // console.group('NewsItemPage.generateMetadata')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('resp...', resp)
  // console.groupEnd()

  // if info exists
  if (newsItem?.title && newsItem?.summary){
    // extract domain to use in url
    const domain = headersList.get('host') || ''

    // build metadata
    const metadata = createMetadata({
      domain,
      page_title: newsItem?.title,
      description: newsItem?.summary,
      url: `https://${domain}/news/${date}/${slug}`,
      // if image present return array with image else []
      image_url: newsItem.image_for_news[0]?.image_id ? [
        `https://${domain}${getImageUrl(newsItem.image_for_news[0].image_id)}`
      ]:[]
    })
    return metadata
  }

  return {
    title: `News | ${app.title}`,
    description: 'News item published on RSD',
  }
}


export default async function NewsItemPage({
  params
}:Readonly<{
  params: Promise<{slug: string, date:string}>,
}>){

  const [{slug,date},{token}] = await Promise.all([
    params,
    getUserSettings()
  ])

  if (!date || !slug){
    return notFound()
  }

  const [user, newsItem] = await Promise.all([
    getUserFromToken(token),
    getNewsItemBySlug({date, slug, token})
  ])

  if (!newsItem){
    return notFound()
  }

  // console.group('NewsItemPage')
  // console.log('params...', params)
  // console.log('token...', token)
  // console.log('date...', date)
  // console.log('slug...', slug)
  // console.log('newsItem...', newsItem)
  // console.groupEnd()

  return (
    <>
      {/* BREADCRUMBS */}
      <section className="w-full my-4">
        <NewsItemBreadcrumbs slug={[slug]} />
      </section>
      <article className="flex-1 lg:w-[64rem] lg:mx-auto mb-12 p-8 bg-base-100 rounded-lg relative">
        {/* ARTICLE HEADER */}
        <NewsItemHeader
          title={newsItem.title}
          publication_date={newsItem.publication_date}
          author={newsItem.author}
        />
        {/* ARTICLE BODY (markdown) */}
        <ReactMarkdownWithSettings
          markdown={newsItem.description}
          className='pt-4 md:pt-8 px-1 max-w-3xl'
        />
        {/* RSD ADMIN MENU */}
        {
          user?.role==='rsd_admin' ?
            <NewsItemMenu item={newsItem} />
            : null
        }
      </article>
    </>
  )

}
