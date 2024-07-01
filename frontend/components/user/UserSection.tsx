// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import dynamic from 'next/dynamic'
import ContentLoader from '../layout/ContentLoader'
import {UserPageId} from './UserNavItems'

// dynamically import user pages
const UserSettings = dynamic(() => import('./settings'),{
  loading: ()=><ContentLoader />
})

const UserSoftware = dynamic(() => import('./software'),{
  loading: ()=><ContentLoader />
})

const UserProjects = dynamic(() => import('./project'),{
  loading: ()=><ContentLoader />
})

const Organisations = dynamic(() => import('./organisations'),{
  loading: ()=><ContentLoader />
})

const Communities = dynamic(() => import('./communities'),{
  loading: ()=><ContentLoader />
})

const ProjectQuality = dynamic(() => import('./project-quality'),{
  loading: ()=><ContentLoader />
})

type UserSectionProps = Readonly<{
  section: UserPageId
  orcidAuthLink: string|null
}>

export default function UserSection({section,orcidAuthLink}:UserSectionProps) {

  switch(section){
    case 'projects':
      return <UserProjects />
    case 'organisations':
      return <Organisations />
    case 'communities':
      return <Communities />
    case 'project-quality':
      return <ProjectQuality />
    case 'settings':
      return <UserSettings orcidAuthLink={orcidAuthLink} />
    case 'software':
    default:
      return <UserSoftware />
  }

}
