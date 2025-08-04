// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DescriptionIcon from '@mui/icons-material/Description'
import GroupIcon from '@mui/icons-material/Group'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import DomainAddIcon from '@mui/icons-material/DomainAdd'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import FluorescentIcon from '@mui/icons-material/Fluorescent'
import CampaignIcon from '@mui/icons-material/Campaign'
import BugReportIcon from '@mui/icons-material/BugReport'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import CategoryIcon from '@mui/icons-material/Category'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HubIcon from '@mui/icons-material/Hub'
import InfoIcon from '@mui/icons-material/Info'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import {editMenuItemButtonSx} from '~/config/menuItems'
import {RsdModuleName} from '~/config/rsdSettingsReducer'
import useRsdSettings from '~/config/useRsdSettings'

export type AdminMenuItemProps={
  title: string
  subtitle: string
  icon: JSX.Element,
  path: string
  active: (props:any) => boolean
}

export const adminPages = {
  pages:{
    title: 'Public pages',
    subtitle: '',
    icon: <DescriptionIcon />,
    path: '/admin/public-pages',
    active: () => true,
  },
  softwareHighlights:{
    title: 'Software highlights',
    subtitle: '',
    icon: <FluorescentIcon />,
    path: '/admin/software-highlights',
    active: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('software'),
  },
  rsd_invites:{
    title: 'RSD invites',
    subtitle: '',
    icon: <PersonAddIcon />,
    path: '/admin/rsd-invites',
    active: () => true,
  },
  accounts:{
    title: 'RSD users',
    subtitle: '',
    icon: <GroupIcon />,
    path: '/admin/rsd-users',
    active: () => true,
  },
  contributors:{
    title: 'RSD contributors',
    subtitle: '',
    icon: <AccountCircleIcon />,
    path: '/admin/rsd-contributors',
    active: () => true,
  },
  software: {
    title: 'Software',
    subtitle: '',
    icon: <TerminalIcon />,
    path: '/admin/software',
    active: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('software'),
  },
  projects: {
    title: 'Projects',
    subtitle: '',
    icon: <ListAltIcon />,
    path: '/admin/projects',
    active: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('projects'),
  },
  organisations: {
    title: 'Organisations',
    subtitle: '',
    icon: <DomainAddIcon />,
    path: '/admin/organisations',
    active: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('organisations'),
  },
  communities: {
    title: 'Communities',
    subtitle: '',
    icon: <Diversity3Icon />,
    path: '/admin/communities',
    active: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('communities') && modules?.includes('software'),
  },
  keywords:{
    title: 'Keywords',
    subtitle: '',
    icon: <SpellcheckIcon />,
    path: '/admin/keywords',
    active: () => true,
  },
  categories:{
    title: 'Categories',
    subtitle: '',
    icon: <CategoryIcon />,
    path: '/admin/categories',
    active: () => true,
  },
  mentions: {
    title: 'Mentions',
    subtitle: '',
    icon: <ReceiptLongIcon />,
    path: '/admin/mentions',
    active: () => true,
  },
  rsd_info:{
    title: 'RSD info',
    subtitle: '',
    icon: <InfoIcon />,
    path: '/admin/rsd-info',
    active: () => true,
  },
  remote_rsd: {
    title: 'Remotes',
    subtitle: '',
    icon: <HubIcon />,
    path: '/admin/remote-rsd',
    active: () => true,
  },
  logs:{
    title: 'Error logs',
    subtitle: '',
    icon: <BugReportIcon />,
    path: '/admin/logs',
    active: () => true,
  },
  announcements: {
    title: 'Announcement',
    subtitle: '',
    icon: <CampaignIcon />,
    path: '/admin/announcements',
    active: () => true,
  },
}

// extract page types from the object
export type AdminPageTypes = keyof typeof adminPages

export default function AdminNav() {
  const router = useRouter()
  const items = Object.keys(adminPages)
  const {activeModules} = useRsdSettings()

  // console.group("AdminNav")
  // console.log("items...",items)
  // console.log("host...",host)
  // console.groupEnd()

  return (
    <nav>
      <List sx={{
        width:['100%','100%','17rem']
      }}>
        {items.map((key, pos) => {
          const item:AdminMenuItemProps = adminPages[key as AdminPageTypes]
          if (item.active({modules:activeModules})===true){
            return (
              <ListItemButton
                data-testid="admin-nav-item"
                key={`step-${pos}`}
                selected={item.path === router.route}
                href = {item.path}
                component = {Link}
                sx={{...editMenuItemButtonSx,
                  ':hover': {
                    color: 'text.primary'
                  }
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} secondary={item.subtitle} />
              </ListItemButton>
            )
          }
        })}
      </List>
    </nav>
  )
}
