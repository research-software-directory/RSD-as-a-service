// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import InfoIcon from '@mui/icons-material/Info'
import TerminalIcon from '@mui/icons-material/Terminal'
import SettingsIcon from '@mui/icons-material/Settings'

import {OrganisationForOverview} from '~/types/Organisation'

type IsVisibleProps = Partial<OrganisationForOverview> & {
  isMaintainer: boolean
}

export type CommunityTabItemProps = {
  id: string,
  label: (props:any)=>string,
  icon: JSX.Element,
  isVisible: (props: IsVisibleProps) => boolean
}

export type TabKey = 'about'|'software'|'settings'
export type CommunityTabProps = {
  [key in TabKey]: CommunityTabItemProps
}

/**
 * Community Tab items. Defines tab values.
 * NOTE! When changing the tab options also update
 * TabContent.tsx file to load proper component.
 */
export const communityTabItems:CommunityTabProps = {
  software: {
    id:'software',
    label:({software_cnt})=>`Software (${software_cnt ?? 0})`,
    icon: <TerminalIcon />,
    isVisible: (props) => true,
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
