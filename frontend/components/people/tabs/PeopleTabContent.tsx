// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import dynamic from 'next/dynamic'

import logger from '~/utils/logger'
import {PeopleTabKey} from './PeopleTabItems'
import ContentLoader from '~/components/layout/ContentLoader'
import PeopleSoftware from '../software'
const PeopleProjects = dynamic(()=> import ('../projects'),{
  loading: ()=><ContentLoader />
})
const PeopleSettings = dynamic(()=> import ('../settings'),{
  loading: ()=><ContentLoader />
})

export default function PeopleTabContent({tab_id}:{tab_id:PeopleTabKey}) {
  // const select_tab = useSelectedTab(tab_id)
  // tab router
  switch (tab_id) {
    case 'projects':
      return <PeopleProjects />
    case 'settings':
      return <PeopleSettings />
    case 'software':
      return <PeopleSoftware />
    default:
      logger(`Unknown tab_id ${tab_id}...returning default software tab`,'warn')
      return <PeopleSoftware />
  }
}
