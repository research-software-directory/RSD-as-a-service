
import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth'
import {getUserSettings} from '~/utils/userSettingsApp'
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
  {params}:{params: Promise<{ slug: string }>}
): Promise<Metadata> {
  // read route params
  const {slug} = await params
  const {token} = await getUserSettings()

  // find community by slug
  const {community} = await getCommunityBySlug({
    slug: slug ?? '',
    token: token,
    user: null
  })

  // console.group('CommunityPageLayout.generateMetadata')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('community...', community)
  // console.groupEnd()

  // if organisation exists we create metadata
  if (community?.name && community?.short_description){
    return {
      title: `${community.name} | ${app.title}`,
      description: community.short_description ?? `${community?.name ?? 'The RSD community'} with ${community.software_cnt ?? 0} software packages.`
    }
  }

  return {
    title: `Community | ${app.title}`,
    description: 'This community is part of RSD',
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
  params: Promise<{ slug: string }>
}>) {
  // get slug and token
  const [{slug},{token}] = await Promise.all([
    params,
    getUserSettings()
  ])
  const user = getUserFromToken(token ?? null)
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
