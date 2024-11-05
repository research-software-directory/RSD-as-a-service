// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'

import {OrganisationTabItemProps} from '~/components/organisation/tabs/OrganisationTabItems'

export type ProfileTabKey = 'software' | 'projects'

export type ProfileTabProps = {
  [key in ProfileTabKey]: OrganisationTabItemProps
}

export const profileTabItems:ProfileTabProps = {
  software: {
    id:'software',
    label:({software_cnt})=>`Software (${software_cnt ?? 0})`,
    icon: <TerminalIcon />,
    isVisible: () => true,
  },
  projects:{
    id:'projects',
    label: ({project_cnt})=>`Projects (${project_cnt ?? 0})`,
    icon: <ListAltIcon />,
    isVisible: () => true,
  }
}
