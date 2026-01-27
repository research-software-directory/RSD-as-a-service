// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'

import AppShortcutIcon from '@mui/icons-material/AppShortcut'
import GroupIcon from '@mui/icons-material/Group'
import BusinessIcon from '@mui/icons-material/Business'
import AddCommentIcon from '@mui/icons-material/AddComment'
import ThreePIcon from '@mui/icons-material/ThreeP'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import JoinInnerIcon from '@mui/icons-material/JoinInner'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import ArticleIcon from '@mui/icons-material/Article'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import CodeIcon from '@mui/icons-material/Code'
import SoftwareHeritageIcon from './software-heritage/SoftwareHeritageIcon'

import {RsdModuleName} from '~/config/rsdSettingsReducer'


export type EditSoftwareMenuItemsProps = {
  id: string
  status: string,
  label: string,
  icon: JSX.Element,
  active: (props:any) => boolean
}

export const defaultPageId = 'information'

export type EditSoftwarePageId = 'information' | 'repositories' | 'links' | 'contributors' | 'organisations'| 'mentions' |
  'testimonials' | 'package-managers'|'software-heritage'|'communities'|'related-projects' | 'related-software' | 'maintainers'|
  'services'


export const editSoftwareMenuItems:EditSoftwareMenuItemsProps[] = [{
  id: 'information',
  label: 'Description',
  icon: <ArticleIcon />,
  active: () => true,
  status: ''
},{
  id: 'repositories',
  label: 'Source code',
  icon: <CodeIcon />,
  active: () => true,
  status: ''
},{
  id: 'links',
  label: 'Links & metadata',
  icon: <AppShortcutIcon />,
  active: () => true,
  status: ''
},{
  id: 'contributors',
  label: 'Contributors',
  icon: <GroupIcon />,
  active: () => true,
  status: ''
},{
  id: 'organisations',
  label: 'Organisations',
  icon: <BusinessIcon />,
  active: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('organisations'),
  status: ''
},{
  id: 'mentions',
  label: 'Mentions',
  icon: <AddCommentIcon />,
  active: () => true,
  status: ''
},{
  id: 'testimonials',
  label: 'Testimonials',
  icon: <ThreePIcon />,
  active: () => true,
  status: ''
},{
  id: 'package-managers',
  label: 'Package managers',
  icon: <HomeRepairServiceIcon />,
  active: () => true,
  status: ''
},{
  id: 'software-heritage',
  label: 'Software Heritage',
  icon: <SoftwareHeritageIcon />,
  active: () => true,
  status: ''
},{
  id: 'communities',
  label: 'Communities',
  icon: <Diversity3Icon />,
  active: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('communities'),
  status: ''
},{
  id: 'related-software',
  label: 'Related software',
  icon: <JoinInnerIcon />,
  active: () => true,
  status: ''
},{
  id: 'related-projects',
  label: 'Related projects',
  icon: <DonutLargeIcon />,
  active: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('projects'),
  status: ''
},{
  id: 'maintainers',
  label: 'Maintainers',
  icon: <PersonAddIcon />,
  active: () => true,
  status: ''
},
// {
//   id: 'services',
//   label: 'Background services',
//   icon: <MiscellaneousServicesIcon />,
//   active: () => true,
//   status: ''
// }
]
