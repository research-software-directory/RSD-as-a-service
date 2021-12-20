import {signOut} from "next-auth/react"
import {MenuItemType} from "./menuItems"

export const userMenuItems:MenuItemType[]=[{
  label:"Logout",
  fn: ()=>{
    // next-auth method to signout user
    signOut()
  }
},{
  label:"My software",
  path:"/user/software"
},{
  label:"My profile",
  path:"/user/profile"
}]
