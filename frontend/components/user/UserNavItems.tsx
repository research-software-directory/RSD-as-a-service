// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import BusinessIcon from '@mui/icons-material/Business'
import SettingsIcon from '@mui/icons-material/Settings'

import UserSettings from './settings'
import UserSoftware from './software'
import UserProjects from './project'
import Organisations from './organisations'

export type UserMenuProps = {
  id: string,
  status: string,
  label: (props:any)=>string,
  icon: JSX.Element,
  component: (props: any) => JSX.Element
  showSearch: boolean
}

export type UserMenuItems = {
  [key:string]:UserMenuProps
}

export const userMenu:UserMenuItems = {
  software:{
    id:'software',
    label:({software_cnt})=>`Software (${software_cnt ?? 0})`,
    icon: <TerminalIcon />,
    component: (props?) => <UserSoftware {...props} />,
    status: 'Software you maintain',
    showSearch: true
  },
  projects:{
    id:'projects',
    label: ({project_cnt})=>`Projects (${project_cnt ?? 0})`,
    icon: <ListAltIcon />,
    component: (props?) => <UserProjects {...props} />,
    status: 'Projects you maintain',
    showSearch: true
  },
  organisations:{
    id:'organisations',
    label: ({organisation_cnt})=>`Organisations (${organisation_cnt ?? 0})`,
    icon: <BusinessIcon />,
    component: (props?) => <Organisations {...props} />,
    status: 'Departments or institutions you maintain',
    showSearch: true
  },
  settings:{
    id:'settings',
    label: () => 'Settings',
    icon: <SettingsIcon />,
    component: (props?) => <UserSettings {...props} />,
    status: 'Your profile settings',
    showSearch: false
 }
}
