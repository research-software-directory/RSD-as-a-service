'use client'

import {SoftwareByMaintainer} from 'app/personal-profile/lib/getProfileData'
import RsdSearchSection from './RsdSearchSection'
import UserSoftwareOverview from '~/components/user/software/UserSoftwareOverview'
import {useUserSettings} from '~/config/UserSettingsContext'
import useSoftwareOverviewParams from '~/components/software/overview/useSoftwareOverviewParams'
import useProjectOverviewParams from '~/components/projects/overview/useProjectOverviewParams'
import useFilterQueryChange from '~/components/filter/useFilterQueryChange'


export type RsdOverviewProps = {
  overviewType: 'software' | 'projects' | 'user software'
  items: SoftwareByMaintainer[] //TODO: add types for software and projects
  searchPlaceholder: string
}

export default function RsdOverview({overviewType, items, searchPlaceholder}: RsdOverviewProps) {
  const {rsd_page_layout,setPageLayout} = useUserSettings()

  const softwareOverview = useSoftwareOverviewParams()
  const projectsOverview = useProjectOverviewParams()
  const userSoftwareOverview = useFilterQueryChange()

  const {handleQueryChange} =
    overviewType === 'software' ? softwareOverview :
    overviewType === 'projects' ? projectsOverview :
    userSoftwareOverview

  return (
    <>
    test
      <RsdSearchSection
        page={0}
        rows={12}
        count={items ? items.length : 0}
        placeholder={searchPlaceholder}
        layout={rsd_page_layout}
        layoutOptions={['grid', 'list']}
        setView={setPageLayout}
        handleQueryChange={handleQueryChange}
      />
      <UserSoftwareOverview
        layout={rsd_page_layout}
        software={items ?? []}
        skeleton_items={0}
        loading={false}
        fullWidth={false}
    />
    </>
  )
}
