// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import dynamic from 'next/dynamic'

import logger from '~/utils/logger'
import ContentLoader from '~/components/layout/ContentLoader'
import {UserPageId} from './UserTabItems'


const Software = dynamic(()=> import ('../software'),{
  loading: ()=><ContentLoader />
})

const Projects = dynamic(()=> import ('../project'),{
  loading: ()=><ContentLoader />
})

const Organisations = dynamic(() => import('../organisations'),{
  loading: ()=><ContentLoader />
})

const Communities = dynamic(() => import('../communities'),{
  loading: ()=><ContentLoader />
})

const ProjectQuality = dynamic(() => import('../project-quality'),{
  loading: ()=><ContentLoader />
})

const UserSettings = dynamic(() => import('../settings'),{
  loading: ()=><ContentLoader />
})


export default function UserTabContent({tab}:Readonly<{tab: UserPageId}>) {

  switch (tab) {
    case 'software':
      return <Software />
    case 'projects':
      return <Projects />
    case 'organisations':
      return <Organisations />
    case 'communities':
      return <Communities />
    case 'project-quality':
      return <ProjectQuality />
    case 'settings':
      return <UserSettings />
    default:
      logger(`UserTabContent: Unknown tab_id ${tab}...returning default software tab`,'warn')
      return (
        <h1>404 page not found!</h1>
      )
  }

}
