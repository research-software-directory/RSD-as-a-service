// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import dynamic from 'next/dynamic'

import FeedIcon from '@mui/icons-material/Feed'
import TeamsIcon from '@mui/icons-material/Groups'
import BusinessIcon from '@mui/icons-material/Business'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TerminalIcon from '@mui/icons-material/Terminal'
import ContentLoader from '~/components/layout/ContentLoader'
import JoinInnerIcon from '@mui/icons-material/JoinInner'
import AddCommentIcon from '@mui/icons-material/AddComment'
import ThreePIcon from '@mui/icons-material/ThreeP'

// use dynamic imports
const ProjectInformation = dynamic(() => import('./information'),{
  loading: ()=><ContentLoader />
})
const ProjectTeam = dynamic(() => import('./team'),{
  loading: ()=><ContentLoader />
})
const ProjectOrganisations = dynamic(() => import('./organisations'),{
  loading: ()=><ContentLoader />
})
const ProjectMentions = dynamic(() => import('./mentions'),{
  loading: ()=><ContentLoader />
})
const RelatedProjects = dynamic(() => import('./related-projects'),{
  loading: ()=><ContentLoader />
})
const RelatedSoftware = dynamic(() => import('./related-software'),{
  loading: ()=><ContentLoader />
})
const ProjectTestimonials = dynamic(() => import('./testimonials'),{
  loading: ()=><ContentLoader />
})

const ProjectMaintainers = dynamic(() => import('./maintainers'),{
  loading: ()=><ContentLoader />
})

export type EditProjectPageProps = {
  id: string,
  status: string,
  label: string,
  icon: JSX.Element,
  render: () => JSX.Element
}

export const editProjectPage: EditProjectPageProps[] = [
  {
    id: 'information',
    label: 'Project details',
    icon: <FeedIcon />,
    render: () => <ProjectInformation />,
    status: ''
  },
  {
    id: 'team',
    label: 'Team',
    icon: <TeamsIcon />,
    render: () => <ProjectTeam />,
    status: ''
  },
  {
    id: 'organisations',
    label: 'Organisations',
    icon: <BusinessIcon />,
    render: () => <ProjectOrganisations />,
    status: ''
  },
  {
    id: 'mentions',
    label: 'Mentions',
    icon: <AddCommentIcon />,
    render: () => <ProjectMentions />,
    status: ''
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: <ThreePIcon />,
    render: () => <ProjectTestimonials />,
    status: ''
  },
  {
    id: 'related-projects',
    label: 'Related projects',
    icon: <JoinInnerIcon />,
    render: () => <RelatedProjects />,
    status: ''
  },
  {
    id: 'related-software',
    label: 'Related software',
    icon: <TerminalIcon />,
    render: () => <RelatedSoftware />,
    status: ''
  },
  {
    id: 'maintainers',
    label: 'Maintainers',
    icon: <PersonAddIcon />,
    render: () => <ProjectMaintainers />,
    status: ''
  }
]
