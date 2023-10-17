// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import SettingsIcon from '@mui/icons-material/Settings'

import {OrganisationTabItemProps} from '~/components/organisation/tabs/OrganisationTabItems'

export type PeopleTabKey = 'software' | 'projects' | 'settings'

export type PeopleTabProps = {
  [key in PeopleTabKey]: OrganisationTabItemProps
}

export const profileTabItems:PeopleTabProps = {
  software: {
    id:'software',
    label:({software_cnt})=>`Software (${software_cnt ?? 0})`,
    icon: <TerminalIcon />,
    isVisible: (props) => true,
  },
  projects:{
    id:'projects',
    label: ({project_cnt})=>`Projects (${project_cnt ?? 0})`,
    icon: <ListAltIcon />,
    isVisible: (props) => true,
  },
  settings:{
    id:'settings',
    label:()=>'Settings',
    icon: <SettingsIcon />,
    // we do not show this option if not a maintainer
    isVisible: ({isMaintainer}) => isMaintainer
  }
}
