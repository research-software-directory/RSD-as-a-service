// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

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

export const adminPages = {
  pages:{
    title: 'Public pages',
    subtitle: '',
    icon: <DescriptionIcon />,
    path: '/admin/public-pages',
  },
  softwareHighlights:{
    title: 'Software highlights',
    subtitle: '',
    icon: <FluorescentIcon />,
    path: '/admin/software-highlights',
  },
  rsd_invites:{
    title: 'RSD invites',
    subtitle: '',
    icon: <PersonAddIcon />,
    path: '/admin/rsd-invites',
  },
  accounts:{
    title: 'RSD users',
    subtitle: '',
    icon: <GroupIcon />,
    path: '/admin/rsd-users',
  },
  contributors:{
    title: 'RSD contributors',
    subtitle: '',
    icon: <AccountCircleIcon />,
    path: '/admin/rsd-contributors',
  },
  software: {
    title: 'Software',
    subtitle: '',
    icon: <TerminalIcon />,
    path: '/admin/software',
  },
  projects: {
    title: 'Projects',
    subtitle: '',
    icon: <ListAltIcon />,
    path: '/admin/projects',
  },
  organisations: {
    title: 'Organisations',
    subtitle: '',
    icon: <DomainAddIcon />,
    path: '/admin/organisations',
  },
  communities: {
    title: 'Communities',
    subtitle: '',
    icon: <Diversity3Icon />,
    path: '/admin/communities',
  },
  keywords:{
    title: 'Keywords',
    subtitle: '',
    icon: <SpellcheckIcon />,
    path: '/admin/keywords',
  },
  categories:{
    title: 'Categories',
    subtitle: '',
    icon: <CategoryIcon />,
    path: '/admin/categories',
  },
  mentions: {
    title: 'Mentions',
    subtitle: '',
    icon: <ReceiptLongIcon />,
    path: '/admin/mentions',
  },
  rsd_info:{
    title: 'RSD info',
    subtitle: '',
    icon: <InfoIcon />,
    path: '/admin/rsd-info',
  },
  remote_rsd: {
    title: 'Remotes',
    subtitle: '',
    icon: <HubIcon />,
    path: '/admin/remote-rsd',
  },
  logs:{
    title: 'Error logs',
    subtitle: '',
    icon: <BugReportIcon />,
    path: '/admin/logs',
  },
  announcements: {
    title: 'Announcement',
    subtitle: '',
    icon: <CampaignIcon />,
    path: '/admin/announcements',
  },
}

// extract page types from the object
type pageTypes = keyof typeof adminPages
// extract page properties from first admin item
type pageProps = typeof adminPages.accounts

export default function AdminNav() {
  const router = useRouter()
  const items = Object.keys(adminPages)

  return (
    <nav>
      <List sx={{
        width:['100%','100%','17rem']
      }}>
        {items.map((key, pos) => {
          const item:pageProps = adminPages[key as pageTypes]
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
        })}
      </List>
    </nav>
  )
}
