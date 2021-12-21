
export type MenuItemType = {
  label: string,
  path?: string,
  active?: boolean
  // optional, but fn is provided it will have higher priority
  // than path
  fn?: Function,
}
// routes defined for nav/menu
// used in components/AppHeader
export const menuItems:MenuItemType[] = [
  // {path:"/", label:"Home"},
  {path:'/software', label:'Software'},
  {path:'/projects', label:'Projects'},
  // will be done later
  // {path:"/about", label:"About"},
]
