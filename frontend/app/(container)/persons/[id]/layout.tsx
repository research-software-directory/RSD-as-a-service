import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {parsePersonId} from '~/components/profile/apiProfile'
import {ProfileContextProvider} from '~/components/profile/context/ProfileContext'
import ProfileMetadata from '~/components/profile/metadata'
import ProfileTabs from '~/components/profile/tabs'
import {getPersonStats} from '~/components/profile/overview/apiPersonsOverview'
import {getPublicUserProfile} from '~/components/user/settings/profile/apiUserProfile'

/**
 * Next.js app builtin function to dynamically create page metadata
 * @param param0
 * @returns
 */
export async function generateMetadata(
  {params}:{params: Promise<{id: string}>}
): Promise<Metadata> {
  // read route params
  const {id} = await params
  // identify if id is orcid or account id
  const {account,orcid} = parsePersonId(id)
  // get public profile
  const publicProfile = await getPublicUserProfile({orcid,account})

  // console.group('PersonPageLayout.generateMetadata')
  // console.log('id...', id)
  // console.log('account...', account)
  // console.log('orcid...', orcid)
  // console.groupEnd()

  // if organisation exists we create metadata
  if (publicProfile?.given_names && publicProfile.family_names){
    return {
      title: `${publicProfile.given_names} ${publicProfile.family_names} | ${app.title}`,
      description: 'Public profile on RSD',
    }
  }

  return {
    title: `Persons | ${app.title}`,
    description: 'Public profile on RSD',
  }
}

export default async function PersonPageLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  // extract slug from params
  params: Promise<{id: string}>
}>){

  const {id} = await params
  if (!id){
    return notFound()
  }

  // identify if id is orcid or account id
  const {account,orcid} = parsePersonId(id)
  // get public profile
  const publicProfile = await getPublicUserProfile({orcid,account})
  // 404 if profile is null (not found in public_user_profile)
  if (publicProfile===null){
    return notFound()
  }
  // get initial software and project counts
  const counts = await getPersonStats({
    account: publicProfile.account
  })

  // console.group('PersonPageLayout')
  // console.log('account...', account)
  // console.log('orcid...', orcid)
  // console.log('counts...',counts)
  // console.groupEnd()

  return (
    <ProfileContextProvider
      software_cnt={counts.software_cnt}
      project_cnt={counts.project_cnt}
    >
      {/* PROFILE METADATA */}
      <ProfileMetadata profile={publicProfile}/>

      {/* TABS */}
      <ProfileTabs />

      {/* TAB CONTENT */}
      <section className="flex md:min-h-[60rem] mb-12">
        {children}
      </section>
    </ProfileContextProvider>
  )
}
