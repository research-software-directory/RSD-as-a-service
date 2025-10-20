// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import InfoIcon from '@mui/icons-material/Info'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import CategoryIcon from '@mui/icons-material/Category'

export type SettingsMenuProps = {
  id: string,
  status: string,
  label: (props?:any)=>string,
  icon: JSX.Element
}
export type SettingsPageId = 'general' | 'categories' | 'maintainers' | 'about'

export const defaultTab:SettingsPageId = 'general'
export const settingsMenu: SettingsMenuProps[] = [
  {
    id:'general',
    label:()=>'General settings',
    icon: <SettingsIcon />,
    status: 'Organisation details'
  },
  {
    id:'categories',
    label:()=>'Categories',
    icon: <CategoryIcon />,
    status: 'Define categories',
  },
  {
    id:'maintainers',
    label:()=>'Maintainers',
    icon: <PersonIcon />,
    status: 'Maintainers of organisation',
  },
  {
    id:'about',
    label:()=>'About',
    icon: <InfoIcon />,
    status: 'Custom about page',
  }
]
