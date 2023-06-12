// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import InfoIcon from '@mui/icons-material/Info'
import TeamsIcon from '@mui/icons-material/Groups'
import FactoryIcon from '@mui/icons-material/Factory'
import OutboundIcon from '@mui/icons-material/Outbound'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import ShareIcon from '@mui/icons-material/Share'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import ProjectInformation from './information'
import ProjectTeam from './team'
import ProjectOrganisations from './organisations'
import ProjectImpact from './impact'
import ProjectOutput from './output'
import RelatedTopics from './related'
import ProjectMaintainers from './maintainers'

export type EditProjectStep = {
  formId?:string,
  status: string,
  label: string,
  icon: JSX.Element,
  component: (props: any)=>JSX.Element
}

export const editProjectSteps: EditProjectStep[] = [
  {
    // formId: 'project-information',
    label: 'Information',
    icon: <InfoIcon />,
    component: (props?) => <ProjectInformation {...props} />,
    status: 'Required information'
  },
  {
    // formId: 'project-team',
    label: 'Team',
    icon: <TeamsIcon />,
    component: (props?) => <ProjectTeam {...props} />,
    status: 'Required information'
  },
  {
    // formId: 'organisations',
    label: 'Organisations',
    icon: <FactoryIcon />,
    component: (props?) => <ProjectOrganisations {...props} />,
    status: 'Optional information'
  },
  {
    // formId: 'impact',
    label: 'Impact',
    icon: <AccessibilityNewIcon />,
    component: (props?) => <ProjectImpact {...props} />,
    status: 'Optional information'
  },
  {
    // formId: 'output',
    label: 'Output',
    icon: <OutboundIcon />,
    component: (props?) => <ProjectOutput {...props} />,
    status: 'Optional information'
  },
  {
    // formId: 'related-topics',
    label: 'Related topics',
    icon: <ShareIcon />,
    component: (props?) => <RelatedTopics {...props} />,
    status: 'Optional information'
  },
  {
    // formId: 'output',
    label: 'Maintainers',
    icon: <PersonAddIcon />,
    component: (props?) => <ProjectMaintainers {...props} />,
    status: 'Optional information'
  }
]
