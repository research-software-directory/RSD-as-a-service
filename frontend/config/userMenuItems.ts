import {MenuItemType} from './menuItems'

export const userMenuItems:MenuItemType[]=[{
  label:'Logout',
  fn: () => {
      // forward to logout route
      // it removes cookies and resets the authContext
      location.href='/logout'
    }
  },{
    label:'My software',
    path:'/user/software'
  },{
    label:'My profile',
    path:'/user/profile'
  }
]
