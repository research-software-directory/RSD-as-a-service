import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'

import UserProfile from './profile'
import UserSoftware from './software'
import UserProjects from './project'
import Organisations from './organisations'

export type UserMenuProps = {
  id: string,
  status: string,
  label: (props:any)=>string,
  icon: JSX.Element,
  component: (props: any) => JSX.Element
  isVisible: (props: any) => boolean
  showSearch: boolean
}

export type UserMenuItems = {
  [key:string]:UserMenuProps
}

export const userMenu:UserMenuItems = {
  profile:{
    id:'profile',
    label:()=>'Profile',
    icon: <PersonIcon />,
    component: (props?) => <UserProfile {...props} />,
    status: 'User profile info',
    isVisible: (props) => true,
    showSearch: false
  },
  software:{
    id:'software',
    label:({count})=>`Software (${count ?? 0})`,
    icon: <TerminalIcon />,
    component: (props?) => <UserSoftware {...props} />,
    status: 'You are maintainer of software',
    isVisible: (props) => true,
    showSearch: true
  },
  projects:{
    id:'projects',
    label: ({count})=>`Projects (${count ?? 0})`,
    icon: <ListAltIcon />,
    component: (props?) => <UserProjects {...props} />,
    status: 'You are maintainer of projects',
    isVisible: (props) => true,
    showSearch: true
  },
  organisations:{
    id:'organisations',
    label: ({count})=>`Organisations (${count ?? 0})`,
    icon: <BusinessIcon />,
    component: (props?) => <Organisations {...props} />,
    status: 'Departments or institutions',
    isVisible: (props) => true,
    showSearch: true
  },
}
