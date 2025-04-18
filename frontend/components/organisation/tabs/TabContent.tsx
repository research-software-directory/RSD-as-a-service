// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import dynamic from 'next/dynamic'

import logger from '~/utils/logger'
import ContentLoader from '~/components/layout/ContentLoader'
import {TabKey} from './OrganisationTabItems'

// default tab is software
import OrganisationSoftware from '../software'
import useSelectedTab from './useSelectedTab'
import {ReleaseCountByYear, SoftwareReleaseInfo} from '~/components/organisation/releases/apiOrganisationReleases'

import {OrganisationUnitsForOverview} from '~/types/Organisation'
// use dynamic imports instead
const AboutOrganisation = dynamic(() => import('../about'),{
  loading: ()=><ContentLoader />
})
const SoftwareReleases = dynamic(() => import('../releases'),{
  loading: ()=><ContentLoader />
})
const OrganisationProjects = dynamic(() => import('../projects'),{
  loading: ()=><ContentLoader />
})
const OrganisationUnits = dynamic(() => import('../units'),{
  loading: ()=><ContentLoader />
})
const OrganisationSettings = dynamic(() => import('../settings'),{
  loading: ()=><ContentLoader />
})

type TabContentProps = {
  tab_id: TabKey|null
  units: OrganisationUnitsForOverview[]
  releaseCountsByYear: ReleaseCountByYear[] | null
  releases: SoftwareReleaseInfo[] | null
}

export default function TabContent({tab_id, units, releaseCountsByYear, releases}: Readonly<TabContentProps>) {
  const select_tab = useSelectedTab(tab_id)
  // tab router
  switch (select_tab) {
    case 'about':
      return <AboutOrganisation />
    case 'projects':
      return <OrganisationProjects />
    case 'releases':
      return <SoftwareReleases releaseCountsByYear={releaseCountsByYear} releases={releases} />
    case 'settings':
      return <OrganisationSettings />
    case 'software':
      return <OrganisationSoftware />
    case 'units':
      return <OrganisationUnits units={units} />
    default:
      logger(`Unknown tab_id ${tab_id}...returning default software tab`,'warn')
      return <OrganisationSoftware />
  }
}
