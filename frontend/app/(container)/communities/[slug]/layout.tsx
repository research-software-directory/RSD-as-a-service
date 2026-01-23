
import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {headers} from 'next/headers'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth/getSessionServerSide'
import {getImageUrl} from '~/utils/editImage'
import {createMetadata} from '~/components/seo/apiMetadata'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import PageBreadcrumbs from '~/components/layout/PageBreadcrumbs'
import {CommunityProvider} from '~/components/communities/context'
import CommunityMetadata from '~/components/communities/metadata'
import {getCommunityBySlug} from '~/components/communities/apiCommunities'
import {getKeywordsByCommunity} from '~/components/communities/settings/general/apiCommunityKeywords'
import CommunityTabs from '~/components/communities/tabs'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'

/**
 * Next.js app builtin function to dynamically create page metadata
 * @param param0
 * @returns
 */
export async function generateMetadata(
  {params}:{params: Promise<{slug: string}>}
): Promise<Metadata> {
  // read route params
  const [{slug},{token},headersList] = await Promise.all([
    params,
    getUserSettings(),
    headers()
  ])

  // find community by slug
  const {community} = await getCommunityBySlug({
    slug: slug ?? '',
    token: token,
    user: null
  })

  const title = `${community?.name ?? 'Community'} | ${app.title}`
  const description = community?.short_description ?? `${community?.name ?? 'The RSD community'} with ${community?.software_cnt ?? 0} software packages.`

  // console.group('CommunityPageLayout.generateMetadata')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('community...', community)
  // console.groupEnd()

  if (community?.name){
    // extract domain to use in url
    const domain = headersList.get('host') || ''
    // build metadata
    const metadata = createMetadata({
      domain,
      page_title: title,
      description,
      url: `https://${domain}/communities/${slug}`,
      // if image present return array with url else []
      image_url: community.logo_id ? [
        `https://${domain}${getImageUrl(community.logo_id)}`
      ] : []
    })
    return metadata
  }

  return {
    title,
    description
  }
}

/**
 * (Partial) Layout of community page.
 * Note! Base layout (PageBackground/AppHeader/MainContent/AppFooter) is defined in the parent layout.
 * @param param0
 * @returns
 */
export default async function CommunityPageLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  // extract slug from params
  params: Promise<{slug: string}>
}>) {
  // get slug and token
  const [{slug},{token}] = await Promise.all([
    params,
    getUserSettings()
  ])
  const user = await getUserFromToken(token)
  // find community by slug
  const {community,isMaintainer} = await getCommunityBySlug({
    slug: slug ?? '',
    token: token,
    user
  })
  // if community not found we return 404
  if (community === null){
    notFound()
  }
  // get keywords as objects
  const keywords = await getKeywordsByCommunity(community.id,token)

  // console.group('CommunityPageLayout')
  // console.log('isMaintainer...', isMaintainer)
  // console.log('community...', community)
  // console.log('keywords...', keywords)
  // console.groupEnd()

  return (
    <CommunityProvider
      community={{
        ...community,
        // use keywords for editing
        keywords
      }}
      isMaintainer={isMaintainer}
    >
      {/* Only when maintainer */}
      {isMaintainer && <UserAgreementModal />}

      {/* COMMUNITY HEADER */}
      <PageBreadcrumbs
        slug={[slug]}
        root={{
          label:'communities',
          path:'/communities'
        }}
      />
      <CommunityMetadata/>

      {/* TABS */}
      <CommunityTabs/>

      {/* TAB CONTENT */}
      <section className="mt-4 flex md:min-h-[45rem]">
        {children}
      </section>

    </CommunityProvider>
  )
}
