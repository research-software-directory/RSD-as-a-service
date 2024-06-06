// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

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

export const settingsMenu: SettingsMenuProps[] = [
  {
    id:'general',
    label:()=>'General settings',
    icon: <SettingsIcon />,
    status: 'Community details'
  },
  {
    id:'categories',
    label:()=>'Categories',
    icon: <CategoryIcon />,
    status: 'Categories for this community'
  },
  {
    id:'maintainers',
    label:()=>'Maintainers',
    icon: <PersonIcon />,
    status: 'Maintainers of community',
  },
  {
    id:'about',
    label:()=>'About',
    icon: <InfoIcon />,
    status: 'Custom about page',
  }
]
