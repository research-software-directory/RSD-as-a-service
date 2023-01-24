// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import InfoIcon from '@mui/icons-material/Info'
import TerminalIcon from '@mui/icons-material/Terminal'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import ListAltIcon from '@mui/icons-material/ListAlt'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined'

import AboutOrganisation from './about'
import OrganisationSoftware from './software'
import OrganisationProjects from './projects'
import OrganisationUnits from './units'
import OrganisationMaintainers from './maintainers'
import OrganisationSettings from './settings'
import {OrganisationForOverview} from '~/types/Organisation'
import SoftwareReleases from './releases'

export type OrganisationComponentsProps = {
  organisation: OrganisationForOverview,
  isMaintainer: boolean
}

export type OrganisationMenuProps = {
  id: string,
  status: string,
  label: (props:any)=>string,
  icon: JSX.Element,
  component: (props: OrganisationComponentsProps) => JSX.Element
  isVisible: (props: any) => boolean
  showSearch: boolean
}

export const organisationMenu: OrganisationMenuProps[] = [
  {
    id:'about',
    label:()=>'About',
    icon: <InfoIcon />,
    component: (props) => <AboutOrganisation {...props} />,
    status: 'Participating organisation',
    isVisible: ({organisation, isMaintainer}) => {
      // we always show about section to maintainer
      if (isMaintainer === true) return true
      // we do not show to visitors if there is no content
      else if (typeof organisation?.description === 'undefined') return false
      else if (organisation?.description === null) return false
      else if (organisation?.description.trim()==='') return false
      // else the description is present and we show about section
      else return true
    },
    showSearch: false
  },
  {
    id:'software',
    label:({software_cnt})=>`Software (${software_cnt ?? 0})`,
    icon: <TerminalIcon />,
    component: (props) => <OrganisationSoftware {...props} />,
    status: 'Participating organisation',
    isVisible: (props) => true,
    showSearch: true
  },
  {
    id:'releases',
    label:({release_cnt})=>`Releases (${release_cnt ?? 0})`,
    icon: <StyleOutlinedIcon />,
    component: (props) => <SoftwareReleases {...props} />,
    status: 'Software releases',
    isVisible: (props) => true,
    showSearch: false
  },
  {
    id:'projects',
    label: ({project_cnt})=>`Projects (${project_cnt ?? 0})`,
    icon: <ListAltIcon />,
    component: (props) => <OrganisationProjects {...props} />,
    status: 'Participating organisation',
    isVisible: (props) => true,
    showSearch: true
  },
  {
    id:'units',
    label:({children_cnt})=> `Research units (${children_cnt ?? 0})`,
    icon: <AccountTreeIcon />,
    component: (props) => <OrganisationUnits {...props} />,
    status: 'Departments or institutions',
    isVisible: ({organisation: {children_cnt}, isMaintainer}) => {
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
    component: (props) => <OrganisationMaintainers {...props} />,
    status: 'Maintainers of organisation',
    // we do not show this option if not a maintainer
    isVisible: ({isMaintainer}) => isMaintainer,
    showSearch: false
  },
  {
    id:'settings',
    label:()=>'Settings',
    icon: <SettingsIcon />,
    component: (props) => <OrganisationSettings {...props} />,
    status: 'Organisation settings',
    // we do not show this option if not a maintainer
    isVisible: ({isMaintainer}) => isMaintainer,
    showSearch: false
  }
]
