// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'

import InfoIcon from '@mui/icons-material/Info'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import BusinessIcon from '@mui/icons-material/Business'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import SettingsIcon from '@mui/icons-material/Settings'
import TableViewIcon from '@mui/icons-material/TableView'

export type UserPageId = 'software'|'projects'|'organisations'|'communities'|'project-quality'|'settings'|'about'

export type UserPageTabItemProps = {
  id: UserPageId,
  label: (props:any)=>string,
  icon: JSX.Element,
  isVisible: (props: any) => boolean
}

export type UserTabProps = {
  [key in UserPageId]: UserPageTabItemProps
}

/**
 * Organisation Tab items. Defines tab values.
 * NOTE! When changing the tab options also update
 * TabContent.tsx file to load proper component.
 */
export const userTabItems:UserTabProps = {
  software: {
    id:'software',
    label:({software_cnt})=>`My software (${software_cnt ?? 0})`,
    icon: <TerminalIcon/>,
    isVisible: ({modules}) => {
      return modules?.includes('software')
    },
  },
  projects:{
    id:'projects',
    label: ({project_cnt})=>`My projects (${project_cnt ?? 0})`,
    icon: <ListAltIcon />,
    isVisible: ({modules}) => {
      return modules?.includes('projects')
    },
  },
  organisations: {
    id:'organisations',
    label: ({organisation_cnt})=>`My organisations (${organisation_cnt ?? 0})`,
    icon: <BusinessIcon />,
    isVisible: ({modules}) => {
      return modules?.includes('organisations')
    },
  },
  communities:{
    id:'communities',
    label: ({community_cnt})=>`My communities (${community_cnt ?? 0})`,
    icon: <Diversity3Icon />,
    isVisible: ({modules}) => {
      return modules?.includes('communities') && modules?.includes('software')
    },
  },
  'project-quality':{
    id:'project-quality',
    label: () => 'Project metadata',
    icon: <TableViewIcon />,
    // we do not show this option if not a maintainer and project
    isVisible: ({isMaintainer,modules}) => isMaintainer && modules?.includes('projects')
  },
  settings:{
    id:'settings',
    label:()=>'Settings',
    icon: <SettingsIcon />,
    // we do not show this option if not a maintainer
    isVisible: ({isMaintainer}) => isMaintainer
  },
  about: {
    id:'about',
    label:()=>'About',
    icon: <InfoIcon />,
    isVisible: ({description}) => {
      // we always show about section to maintainer
      // if (isMaintainer === true) return true
      // we do not show to visitors if there is no content
      if (typeof description === 'undefined') return false
      else if (description === null) return false
      else if (description.trim()==='') return false
      // else the description is present and we show about section
      else return true
    },
  }
}
