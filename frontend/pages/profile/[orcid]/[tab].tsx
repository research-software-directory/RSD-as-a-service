// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'
import {app} from '~/config/app'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {ProjectListItem} from '~/types/Project'
import {getUserSettings} from '~/utils/userSettings'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import BackgroundAndLayout from '~/components/layout/BackgroundAndLayout'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'
import {RsdContributor} from '~/components/admin/rsd-contributors/useContributors'
import {UserSettingsProvider} from '~/components/organisation/context/UserSettingsContext'
import {getPublicProfile,getProfileProjects,getProfileSoftware} from '~/components/profile/apiProfile'
import ProfileMetadata from '~/components/profile/metadata'
import ProfileTabs from '~/components/profile/tabs'
import ProfileTabContent from '~/components/profile/tabs/ProfileTabContent'
import {ProfileContextProvider} from '~/components/profile/context/ProfileContext'
import {ProfileTabKey} from '~/components/profile/tabs/ProfileTabItems'

type SoftwareByOrcidProps={
  orcid: string
  rsd_page_layout: LayoutType,
  rsd_page_rows: number,
  tab: ProfileTabKey
  profiles: RsdContributor[],
  software_cnt: number,
  software: SoftwareOverviewItemProps[],
  project_cnt: number,
  projects: ProjectListItem[]
}

export default function PublicProfileByOrcidPage({
  orcid,rsd_page_rows,rsd_page_layout,
  tab,profiles,software_cnt,
  software, project_cnt, projects
}:SoftwareByOrcidProps) {

  // console.group('SoftwareByOrcid')
  // console.log('orcid...', orcid)
  // console.log('rsd_page_rows....', rsd_page_rows)
  // console.log('rsd_page_layout....', rsd_page_layout)
  // console.log('tab....', tab)
  // console.log('profiles....', profiles)
  // console.log('software....', software)
  // console.log('software_cnt....', software_cnt)
  // console.log('projects....', projects)
  // console.log('project_cnt....', project_cnt)
  // console.groupEnd()

  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={`${orcid} | ${app.title}`}
        description="Software overview by orcid"
      />
      <CanonicalUrl />
      <BackgroundAndLayout>
        <UserSettingsProvider
          settings={{
            rsd_page_layout,
            rsd_page_rows
          }}
        >
          <ProfileContextProvider value={{
            software_cnt,
            software,
            project_cnt,
            projects
          }}>
            {/* PROFILE METADATA */}
            <ProfileMetadata profiles={profiles} />
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
        </UserSettingsProvider>
      </BackgroundAndLayout>
    </>
  )
}


// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params, req, query} = context
    // check if orcid provided
    if (!params?.orcid){
      return {
        notFound: true,
      }
    }
    // find person by orcid
    const token = req?.cookies['rsd_token']
    const orcid = params?.orcid as string
    const profiles = await getPublicProfile({orcid,token})
    // 404 if profiles is null (not found in the list of public profile)
    if (profiles === null){
      return {
        notFound: true,
      }
    }
    // extract user settings from cookie
    const {rsd_page_layout, rsd_page_rows} = getUserSettings(req)
    // for rows we use query param or user settings definition
    const rows = parseInt(query['rows'] as string ?? rsd_page_rows)
    // get page for pagination
    let page = parseInt(query['page'] as string ?? 0)
    // api works with 0 page index
    if (page>0) page = page-1
    // tab & search
    const tab = params?.tab ?? 'software'
    const search = query?.search as string

    // get both software and projects
    const [software, projects] = await Promise.all([
      getProfileSoftware({
        page: tab==='software' ? page : 0,
        search: tab==='software' && search ? search : undefined,
        orcid,
        rows,
        token
      }),
      getProfileProjects({
        page: tab==='projects' ? page : 0,
        search: tab==='projects' && search ? search : undefined,
        orcid,
        rows,
        token
      })
    ])
    // return data
    return {
      props:{
        rsd_page_layout,
        rsd_page_rows,
        orcid,
        tab,
        profiles,
        ...software,
        ...projects
      }
    }
  }catch(e){
    return {
      notFound: true,
    }
  }
}
