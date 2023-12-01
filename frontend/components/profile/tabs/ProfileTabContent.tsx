// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import dynamic from 'next/dynamic'

import logger from '~/utils/logger'
import ContentLoader from '~/components/layout/ContentLoader'
import {ProfileTabKey} from './ProfileTabItems'

const ProjectsForProfile = dynamic(()=> import ('../projects'),{
  loading: ()=><ContentLoader />
})
const SoftwareForProfile = dynamic(()=> import ('../software'),{
  loading: ()=><ContentLoader />
})

export default function ProfileTabContent({tab_id}:{tab_id:ProfileTabKey}) {
  // const select_tab = useSelectedTab(tab_id)
  // tab router
  switch (tab_id) {
    case 'projects':
      return <ProjectsForProfile />
    case 'software':
      return <SoftwareForProfile />
    default:
      logger(`Unknown tab_id ${tab_id}...returning default software tab`,'warn')
      return <SoftwareForProfile />
  }
}
