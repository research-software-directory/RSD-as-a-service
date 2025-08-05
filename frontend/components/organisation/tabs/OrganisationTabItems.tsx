// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import InfoIcon from '@mui/icons-material/Info'
import TerminalIcon from '@mui/icons-material/Terminal'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import ListAltIcon from '@mui/icons-material/ListAlt'
import SettingsIcon from '@mui/icons-material/Settings'
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined'

import {OrganisationForOverview} from '~/types/Organisation'
import {RsdModuleName} from '~/config/rsdSettingsReducer'


type IsVisibleProps = Partial<OrganisationForOverview> & {
  isMaintainer: boolean
  modules: RsdModuleName[]
}

export type OrganisationTabItemProps = {
  id: string,
  label: (props:any)=>string,
  icon: JSX.Element,
  isVisible: (props: IsVisibleProps) => boolean
}

export type TabKey = 'about'|'software'|'releases'|'projects'|'units'|'settings'
export type OrganisationTabProps = {
  [key in TabKey]: OrganisationTabItemProps
}

/**
 * Organisation Tab items. Defines tab values.
 * NOTE! When changing the tab options also update
 * TabContent.tsx file to load proper component.
 */
export const organisationTabItems:OrganisationTabProps = {
  software: {
    id:'software',
    label:({software_cnt})=>`Software (${software_cnt ?? 0})`,
    icon: <TerminalIcon />,
    isVisible: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('software')
  },
  projects:{
    id:'projects',
    label: ({project_cnt})=>`Projects (${project_cnt ?? 0})`,
    icon: <ListAltIcon />,
    isVisible: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('projects')
  },
  releases: {
    id:'releases',
    label:({release_cnt})=>`Releases (${release_cnt ?? 0})`,
    icon: <StyleOutlinedIcon />,
    isVisible: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('software')
  },
  units:{
    id:'units',
    label:({children_cnt})=> `Research units (${children_cnt ?? 0})`,
    icon: <AccountTreeIcon />,
    isVisible: ({children_cnt, isMaintainer}) => {
      // we do not show this options if no children
      // and not a maintainer
      if (!isMaintainer && (children_cnt === 0 || children_cnt===null)) return false
      return true
    },
  },
  settings:{
    id:'settings',
    label:()=>'Settings',
    icon: <SettingsIcon />,
    // we do not show this option if not a maintainer
    isVisible: ({isMaintainer}) => isMaintainer ?? false
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
