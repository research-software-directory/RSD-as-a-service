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
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'

export type SettingsMenuProps = {
  id: string,
  status: string,
  label: (props?:any)=>string,
  icon: JSX.Element
}

export type UserSettingsTab = 'profile' | 'agreements' | 'about'

export const settingsMenu: SettingsMenuProps[] = [
  {
    id:'profile',
    label:()=>'Profile',
    icon: <PersonIcon />,
    status: 'Your profile'
  },
  {
    id:'about',
    label:()=>'About me',
    icon: <InfoIcon />,
    status: 'Custom about page',
  },
  {
    id:'agreements',
    label:()=>'User agreements',
    icon: <HandshakeOutlinedIcon />,
    status: 'Agree to Terms of Service',
  },
]
