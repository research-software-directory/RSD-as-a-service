// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import dynamic from 'next/dynamic'

import InfoIcon from '@mui/icons-material/Info'
import TeamsIcon from '@mui/icons-material/Groups'
import FactoryIcon from '@mui/icons-material/Factory'
import OutboundIcon from '@mui/icons-material/Outbound'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import ShareIcon from '@mui/icons-material/Share'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TerminalIcon from '@mui/icons-material/Terminal'
import ContentLoader from '~/components/layout/ContentLoader'
import JoinInnerIcon from '@mui/icons-material/JoinInner'

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
const ProjectCitations = dynamic(() => import('./citations'),{
  loading: ()=><ContentLoader />
})
const RelatedProjects = dynamic(() => import('./related-projects'),{
  loading: ()=><ContentLoader />
})
const RelatedSoftware = dynamic(() => import('./related-software'),{
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
    label: 'Information',
    icon: <InfoIcon />,
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
    icon: <FactoryIcon />,
    render: () => <ProjectOrganisations />,
    status: ''
  },
  {
    id: 'output',
    label: 'Output',
    icon: <OutboundIcon />,
    render: () => <ProjectOutput />,
    status: ''
  },
  {
    id: 'impact',
    label: 'Impact',
    icon: <AccessibilityNewIcon />,
    render: () => <ProjectImpact />,
    status: ''
  },
  {
    id: 'citations',
    label: 'Citations',
    icon: <ShareIcon />,
    render: () => <ProjectCitations />,
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
