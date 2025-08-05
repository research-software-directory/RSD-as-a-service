// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import BusinessIcon from '@mui/icons-material/Business'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth'

import {RsdModuleName} from '~/config/rsdSettingsReducer'

export default function SearchItemIcon({source}:Readonly<{source:RsdModuleName}>) {
  switch (source){
    case 'software':
      return <TerminalIcon/>
    case 'projects':
      return <ListAltIcon/>
    case 'organisations':
      return <BusinessIcon/>
    case 'communities':
      return <Diversity3Icon/>
    case 'news':
      return <CalendarViewMonthIcon />
    case 'persons':
      return <AccountCircleIcon/>
    default:
      return null
  }
}
