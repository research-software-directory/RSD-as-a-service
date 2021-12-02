
export type MenuItem = {
  path:string,
  label:string,
  active?:boolean
}
// routes defined for nav/menu
// used in components/AppHeader
export const menuItems:MenuItem[] = [
  // {path:"/", label:"Home"},
  {path:"/software", label:"Software"},
  {path:"/projects", label:"Projects"},
  {path:"/about", label:"About"},
]