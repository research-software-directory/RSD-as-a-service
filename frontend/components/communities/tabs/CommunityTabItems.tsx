// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import TerminalIcon from '@mui/icons-material/Terminal'
import BlockIcon from '@mui/icons-material/Block'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

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

export type TabKey = 'about'|'software'|'requests'|'rejected'|'settings'
export type CommunityTabProps = {
  [key in TabKey]: CommunityTabItemProps
}
export const defaultTabKey='software' as TabKey

/**
 * Community Tab items. Defines tab values.
 */
export const communityTabItems:CommunityTabProps = {
  software: {
    id:'software',
    label:({software_cnt})=>`Software (${software_cnt ?? 0})`,
    icon: <TerminalIcon />,
    isVisible: () => true,
  },
  requests:{
    id:'requests',
    label:({pending_cnt})=>`Requests (${pending_cnt ?? 0})`,
    icon: <FlagOutlinedIcon />,
    // we do not show this option if not a maintainer
    isVisible: ({isMaintainer}) => isMaintainer
  },
  rejected:{
    id:'rejected',
    label:({rejected_cnt})=>`Rejected (${rejected_cnt ?? 0})`,
    icon: <BlockIcon />,
    // we do not show this option if not a maintainer
    isVisible: ({isMaintainer}) => isMaintainer
  },
  settings:{
    id:'settings',
    label:()=>'Settings',
    icon: <SettingsOutlinedIcon />,
    // we do not show this option if not a maintainer
    isVisible: ({isMaintainer}) => isMaintainer
  },
  about: {
    id:'about',
    label:()=>'About',
    icon: <InfoOutlinedIcon />,
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
