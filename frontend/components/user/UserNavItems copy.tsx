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

export const userMenu: UserMenuProps[] = [
  {
    id:'profile',
    label:()=>'Profile',
    icon: <PersonIcon />,
    component: (props?) => <UserProfile {...props} />,
    status: 'User profile info',
    isVisible: (props) => true,
    showSearch: false
  },
  {
    id:'software',
    label:({software_cnt})=>`Software (${software_cnt ?? 0})`,
    icon: <TerminalIcon />,
    component: (props?) => <UserSoftware {...props} />,
    status: 'You are maintainer of software',
    isVisible: (props) => true,
    showSearch: true
  },
  {
    id:'projects',
    label: ({project_cnt})=>`Projects (${project_cnt ?? 0})`,
    icon: <ListAltIcon />,
    component: (props?) => <UserProjects {...props} />,
    status: 'You are maintainer of projects',
    isVisible: (props) => true,
    showSearch: true
  },
  {
    id:'organisations',
    label: ({organisation_cnt})=>`Organisations (${organisation_cnt ?? 0})`,
    icon: <BusinessIcon />,
    component: (props?) => <Organisations {...props} />,
    status: 'Departments or institutions',
    isVisible: (props) => true,
    showSearch: true
  },
]
