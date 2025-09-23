import {notFound} from 'next/navigation'
import {Metadata} from 'next'

import {app} from '~/config/app'
import logger from '~/utils/logger'
import {adminPages, AdminPageTypes} from '~/components/admin/AdminNavItems'
import AdminRsdContributors from '~/components/admin/rsd-contributors'
import AdminRsdInvites from '~/components/admin/rsd-invites'
import AdminRsdUsersPage from '~/components/admin/rsd-users'
import AdminSoftware from '~/components/admin/software'
import AdminSoftwareHighlightsPage from '~/components/admin/software-highlights'
import AdminProjects from '~/components/admin/projects'
import AdminCommunities from '~/components/admin/communities'
import AdminOrganisations from '~/components/admin/organisations'
import AdminPublicPages from '~/components/admin/pages/edit'
import AdminKeywordsPage from '~/components/admin/keywords'
import AdminCategories from '~/components/admin/categories'
import AdminMentions from '~/components/admin/mentions'
import AdminRsdInfo from '~/components/admin/rsd-info'
import AdminRemoteRsd from '~/components/admin/remote-rsd'
import AdminRepositories from '~/components/admin/repositories'
import AdminPackageManagers from '~/components/admin/package-manager'
import AdminErrorLogs from '~/components/admin/logs'
import AdminAnnouncements from '~/components/admin/announcements'

// force to be dynamic route
export const dynamic = 'force-dynamic'

/**
 * Next.js app builtin function to dynamically create page metadata
 * @param param0
 * @returns
 */
export async function generateMetadata(
  {params}:Readonly<{params: Promise<{page: string}>}>
): Promise<Metadata> {
  const {page} = await params

  const pageTitle = adminPages?.[page as AdminPageTypes].title ?? 'Admin page'

  return {
    title: `${pageTitle} | ${app.title}`,
    description: 'Admin section of Research Software Directory',
  }
}

export default async function AdminPage({
  params
}:Readonly<{
  // extract page from params
  params: Promise<{page: string}>
}>){

  const {page} = await params

  switch (page as AdminPageTypes) {
    case 'rsd-invites':
      return <AdminRsdInvites />

    case 'rsd-users':
      return <AdminRsdUsersPage />

    case 'rsd-contributors':
      return <AdminRsdContributors />

    case 'software':
      return <AdminSoftware />

    case 'software-highlights':
      return <AdminSoftwareHighlightsPage />

    case 'projects':
      return <AdminProjects />

    case 'organisations':
      return <AdminOrganisations />

    case 'communities':
      return <AdminCommunities />

    case 'public-pages':
      return <AdminPublicPages />

    case 'keywords':
      return <AdminKeywordsPage />

    case 'categories':
      return <AdminCategories />

    case 'mentions':
      return <AdminMentions />

    case 'rsd-info':
      return <AdminRsdInfo />

    case 'remote-rsd':
      return <AdminRemoteRsd/>

    case 'repositories':
      return <AdminRepositories />

    case 'package-managers':
      return <AdminPackageManagers />

    case 'logs':
      return <AdminErrorLogs />

    case 'announcements':
      return <AdminAnnouncements />

    default:
      logger(`AdminPage: ${page} NOT SUPPORTED`, 'warn')
      return notFound()
  }
}

