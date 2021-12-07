import {useState, useEffect} from 'react'
import Link from 'next/link'
import router from 'next/router'
import {useSession, signOut} from 'next-auth/react'

import IconButton from '@mui/material/IconButton'
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import LogoEscience from './LogoEscience';
import MenuItem from './MenuItem'
import {menuItems} from '../../config/menuItems'

export default function AppHeader(){
  const [activePath, setActivePath] = useState("/")
  const {status} = useSession()

  useEffect(()=>{
    if (typeof window !='undefined'){
      const paths = window.location.pathname.split("/")
      if (paths.length > 0) setActivePath(`/${paths[1]}`)
    }
  },[])

  function getMenuItems(){
    return menuItems.map(item=>{
      // set active flag
      item.active = activePath === item.path
      return (
        <MenuItem
          key={item.path}
          item={item}
        />
      )
    })
  }

  function getLoginButton(){
    if (status==="authenticated"){
      return (
        <IconButton title="Logout"
          onClick={()=>signOut()}
        >
          <LogoutIcon color="secondary"></LogoutIcon>
        </IconButton>
      )
    }
    return (
      <IconButton title="Sign in / Sign up"
        onClick={()=>router.push('/login')}
      >
        <LoginIcon color="primary"></LoginIcon>
      </IconButton>
    )
  }

  return (
    <header className="container mx-auto">
      <div className="flex p-4">
        <Link href="/" passHref>
          <a><LogoEscience className="cursor-pointer"/></a>
        </Link>
        <div className="flex ml-auto">
          {getMenuItems()}
        </div>
        <div className="ml-auto">
          {getLoginButton()}
        </div>
      </div>
    </header>
  )
}