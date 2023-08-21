// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import InfoIcon from '@mui/icons-material/Info'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'

export type SettingsMenuProps = {
  id: string,
  status: string,
  label: (props?:any)=>string,
  icon: JSX.Element
}

export const settingsMenu: SettingsMenuProps[] = [
  {
    id:'general',
    label:()=>'General settings',
    icon: <SettingsIcon />,
    status: 'Organisation settings'
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
    status: 'Define about page',
  }
]
