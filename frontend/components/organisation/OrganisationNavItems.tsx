// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import TerminalIcon from '@mui/icons-material/Terminal'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import ListAltIcon from '@mui/icons-material/ListAlt'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'

import OrganisationSoftware from './software'
import OrganisationProjects from './project'
import OrganisationUnits from './units'
import OrganisationMaintainers from './maintainers'
import OrganisationSettings from './settings'

export type OrganisationMenuProps = {
  id: string,
  status: string,
  label: (props:any)=>string,
  icon: JSX.Element,
  component: (props: any) => JSX.Element
  isVisible: (props: any) => boolean
  showSearch: boolean
}

export const organisationMenu:OrganisationMenuProps[] = [
  {
    id:'software',
    label:({software_cnt})=>`Software (${software_cnt ?? 0})`,
    icon: <TerminalIcon />,
    component: (props?) => <OrganisationSoftware {...props} />,
    status: 'Participating organisation',
    isVisible: (props) => true,
    showSearch: true
  },
  {
    id:'projects',
    label: ({project_cnt})=>`Projects (${project_cnt ?? 0})`,
    icon: <ListAltIcon />,
    component: (props?) => <OrganisationProjects {...props} />,
    status: 'Participating organisation',
    isVisible: (props) => true,
    showSearch: true
  },
  {
    id:'units',
    label:()=> 'Research units',
    icon: <AccountTreeIcon />,
    component: (props?) => <OrganisationUnits {...props} />,
    status: 'Departments or institutions',
    isVisible: ({children_cnt, isMaintainer}) => {
      // we do not show this options if no children
      // and not a maintainer
      if (isMaintainer===false && (children_cnt === 0 || children_cnt===null)) return false
      return true
    },
    showSearch: false
  },
  {
    id:'maintainers',
    label:()=>'Maintainers',
    icon: <PersonIcon />,
    component: (props?) => <OrganisationMaintainers {...props} />,
    status: 'Maintainers of organisation',
    // we do not show this option if not a maintainer
    isVisible: ({isMaintainer}) => isMaintainer,
    showSearch: false
  },
  {
    id:'settings',
    label:()=>'Settings',
    icon: <SettingsIcon />,
    component: (props?) => <OrganisationSettings {...props} />,
    status: 'Organisation settings',
    // we do not show this option if not a maintainer
    isVisible: ({isMaintainer}) => isMaintainer,
    showSearch: false
  }
]
