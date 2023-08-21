// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import dynamic from 'next/dynamic'

import InfoIcon from '@mui/icons-material/Info'
import TeamsIcon from '@mui/icons-material/Groups'
import FactoryIcon from '@mui/icons-material/Factory'
import OutboundIcon from '@mui/icons-material/Outbound'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import ShareIcon from '@mui/icons-material/Share'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ContentLoader from '~/components/layout/ContentLoader'


// import ProjectInformation from './information'
// import ProjectTeam from './team'
// import ProjectOrganisations from './organisations'
// import ProjectImpact from './impact'
// import ProjectOutput from './output'
// import RelatedTopics from './related'
// import ProjectMaintainers from './maintainers'

// use dynamic imports instead
const ProjectInformation = dynamic(() => import('./information'),{
  loading: ()=><ContentLoader />
})
const ProjectTeam = dynamic(() => import('./team'),{
  loading: ()=><ContentLoader />
})
const ProjectOrganisations = dynamic(() => import('./organisations'),{
  loading: ()=><ContentLoader />
})
const ProjectImpact = dynamic(() => import('./impact'),{
  loading: ()=><ContentLoader />
})
const ProjectOutput = dynamic(() => import('./output'),{
  loading: ()=><ContentLoader />
})
const RelatedTopics = dynamic(() => import('./related'),{
  loading: ()=><ContentLoader />
})
const ProjectMaintainers = dynamic(() => import('./maintainers'),{
  loading: ()=><ContentLoader />
})

export type EditProjectPageProps = {
  id: string,
  status: string,
  label: string,
  icon: React.JSX.Element,
  render: () => React.JSX.Element
}

export const editProjectPage: EditProjectPageProps[] = [
  {
    id: 'information',
    label: 'Information',
    icon: <InfoIcon />,
    render: () => <ProjectInformation />,
    status: 'Required information'
  },
  {
    id: 'team',
    label: 'Team',
    icon: <TeamsIcon />,
    render: () => <ProjectTeam />,
    status: 'Required information'
  },
  {
    id: 'organisations',
    label: 'Organisations',
    icon: <FactoryIcon />,
    render: () => <ProjectOrganisations />,
    status: 'Optional information'
  },
  {
    id: 'impact',
    label: 'Impact',
    icon: <AccessibilityNewIcon />,
    render: () => <ProjectImpact />,
    status: 'Optional information'
  },
  {
    id: 'output',
    label: 'Output',
    icon: <OutboundIcon />,
    render: () => <ProjectOutput />,
    status: 'Optional information'
  },
  {
    id: 'related-topics',
    label: 'Related topics',
    icon: <ShareIcon />,
    render: () => <RelatedTopics />,
    status: 'Optional information'
  },
  {
    id: 'maintainers',
    label: 'Maintainers',
    icon: <PersonAddIcon />,
    render: () => <ProjectMaintainers />,
    status: 'Optional information'
  }
]
