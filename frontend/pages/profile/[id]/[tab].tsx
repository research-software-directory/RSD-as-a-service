// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'
import {app} from '~/config/app'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {ProjectListItem} from '~/types/Project'
import {getUserSettings} from '~/utils/userSettings'
import {isOrcid} from '~/utils/getORCID'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import BackgroundAndLayout from '~/components/layout/BackgroundAndLayout'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import {getProfileProjects,getProfileSoftware} from '~/components/profile/apiProfile'
import ProfileMetadata from '~/components/profile/metadata'
import ProfileTabs from '~/components/profile/tabs'
import ProfileTabContent from '~/components/profile/tabs/ProfileTabContent'
import {ProfileContextProvider} from '~/components/profile/context/ProfileContext'
import {ProfileTabKey} from '~/components/profile/tabs/ProfileTabItems'
import {getPublicUserProfile, PublicUserProfile} from '~/components/user/settings/profile/apiUserProfile'

type SoftwareByOrcidProps=Readonly<{
  orcid: string
  tab: ProfileTabKey
  publicProfile: PublicUserProfile,
  software_cnt: number,
  software: SoftwareOverviewItemProps[],
  project_cnt: number,
  projects: ProjectListItem[]
}>

export default function PublicProfileByOrcidPage({
  tab,publicProfile, software_cnt,
  software, project_cnt, projects
}:SoftwareByOrcidProps) {

  // console.group('PublicProfileByOrcidPage')
  // console.log('orcid...', orcid)
  // console.log('rsd_page_rows....', rsd_page_rows)
  // console.log('rsd_page_layout....', rsd_page_layout)
  // console.log('tab....', tab)
  // console.log('profiles....', profiles)
  // console.log('publicProfile....', publicProfile)
  // console.log('software....', software)
  // console.log('software_cnt....', software_cnt)
  // console.log('projects....', projects)
  // console.log('project_cnt....', project_cnt)
  // console.groupEnd()

  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={`${publicProfile.given_names} ${publicProfile.family_names} | ${app.title}`}
        description="Software overview by orcid"
      />
      <CanonicalUrl />
      <BackgroundAndLayout>
        <ProfileContextProvider value={{
          software_cnt,
          software,
          project_cnt,
          projects
        }}>
          {/* PROFILE METADATA */}
          <ProfileMetadata profile={publicProfile}/>
          {/* TABS */}
          <BaseSurfaceRounded
            className="my-4 p-2"
            type="section"
          >
            <ProfileTabs tab_id={tab} isMaintainer={false} />
          </BaseSurfaceRounded>
          {/* TAB CONTENT */}
          <section className="flex md:min-h-[60rem] mb-12">
            <ProfileTabContent tab_id={tab} />
          </section>
        </ProfileContextProvider>
      </BackgroundAndLayout>
    </>
  )
}


// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params, req, query} = context
    // check if id provided
    if (!params?.id){
      return {
        notFound: true,
      }
    }
    // find person by orcid
    const token = req?.cookies['rsd_token']
    let account:string|null = null
    let orcid:string|null = null
    // ID can be ORCID or account id
    if (isOrcid(params?.id.toString())){
      orcid = params?.id.toString()
    } else {
      account = params?.id.toString()
    }
    const publicProfile = await getPublicUserProfile({orcid,account})
    // 404 if profile is null (not found in public_user_profile)
    if (publicProfile === null){
      return {
        notFound: true,
      }
    }
    // extract user settings from cookie
    const {rsd_page_rows} = getUserSettings(req)
    // for rows we use query param or user settings definition
    const rows = parseInt(query['rows'] as string ?? rsd_page_rows)
    // get page for pagination
    let page = parseInt(query['page'] as string ?? 0)
    // api works with 0 page index
    if (page>0) page = page-1
    // tab & search
    const tab = params?.tab ?? 'software'
    const search = query?.search as string

    // get software, projects and public profile
    const [software, projects] = await Promise.all([
      getProfileSoftware({
        page: tab==='software' ? page : 0,
        search: tab==='software' && search ? search : undefined,
        orcid: publicProfile.orcid,
        account: publicProfile.account,
        rows,
        token
      }),
      getProfileProjects({
        page: tab==='projects' ? page : 0,
        search: tab==='projects' && search ? search : undefined,
        orcid: publicProfile.orcid,
        account: publicProfile.account,
        rows,
        token
      })
    ])
    // return data
    return {
      props:{
        orcid,
        tab,
        publicProfile,
        ...software,
        ...projects
      }
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
