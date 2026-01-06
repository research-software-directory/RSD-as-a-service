import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ssrMarkdownPage} from '~/components/admin/pages/useMarkdownPages'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'
import {app} from '~/config/app'

/**
 * Next.js app builtin function to dynamically create page metadata
 * @param param0
 * @returns
 */
export async function generateMetadata(
  {params}:Readonly<{params: Promise<{slug: string}>}>
): Promise<Metadata> {
  // read route params
  const {slug} = await params

  // find community by slug
  const {props} = await ssrMarkdownPage(slug)

  // console.group('CommunityPageLayout.generateMetadata')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('community...', community)
  // console.groupEnd()

  // if organisation exists we create metadata
  if (props){

    return {
      title: `${props.title} | ${app.title}`,
      description: props.markdown.split('\n')[0] ?? `${app.title} custom page article.`
    }
  }

  return {
    title: `Page | ${app.title}`,
    description: `${app.title} custom page article.`
  }
}

export default async function CustomPage({params}:Readonly<{params: Promise<{slug: string}>}>){
  // read route params
  const {slug} = await params

  // find community by slug
  const page = await ssrMarkdownPage(slug)
  // show 404 page if not found
  if (page?.notFound) return notFound()

  // show page
  return (
    <BaseSurfaceRounded className="lg:w-[64rem] lg:mx-auto mt-12 px-12 bg-base-100 rounded-lg">
      <ReactMarkdownWithSettings
        className='p-8'
        markdown={page?.props?.markdown ?? ''}
      />
    </BaseSurfaceRounded>
  )
}

