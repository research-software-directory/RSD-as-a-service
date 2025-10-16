// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'

import FeedIcon from '@mui/icons-material/Feed'
import TeamsIcon from '@mui/icons-material/Groups'
import BusinessIcon from '@mui/icons-material/Business'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TerminalIcon from '@mui/icons-material/Terminal'
import JoinInnerIcon from '@mui/icons-material/JoinInner'
import AddCommentIcon from '@mui/icons-material/AddComment'
import ThreePIcon from '@mui/icons-material/ThreeP'
import {RsdModuleName} from '~/config/rsdSettingsReducer'

export type EditProjectMenuItemProps = {
  id: string,
  status: string,
  label: string,
  icon: JSX.Element,
  active: (props:any) => boolean
}

export const defaultEditPageId = 'information'
export type EditProjectPageId = 'information' | 'team' | 'organisations' | 'mentions' | 'testimonials' | 'related-projects' | 'related-software' | 'maintainers'

export const editProjectMenuItems: EditProjectMenuItemProps[] = [
  {
    id: 'information',
    label: 'Project details',
    icon: <FeedIcon />,
    active: () => true,
    status: ''
  },
  {
    id: 'team',
    label: 'Team',
    icon: <TeamsIcon />,
    active: () => true,
    status: ''
  },
  {
    id: 'organisations',
    label: 'Organisations',
    icon: <BusinessIcon />,
    active: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('organisations'),
    status: ''
  },
  {
    id: 'mentions',
    label: 'Mentions',
    icon: <AddCommentIcon />,
    active: () => true,
    status: ''
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: <ThreePIcon />,
    active: () => true,
    status: ''
  },
  {
    id: 'related-projects',
    label: 'Related projects',
    icon: <JoinInnerIcon />,
    active: () => true,
    status: ''
  },
  {
    id: 'related-software',
    label: 'Related software',
    icon: <TerminalIcon />,
    active: ({modules}:{modules:RsdModuleName[]}) => modules?.includes('software'),
    status: ''
  },
  {
    id: 'maintainers',
    label: 'Maintainers',
    icon: <PersonAddIcon />,
    active: () => true,
    status: ''
  }
]
