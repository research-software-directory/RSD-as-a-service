// external dependencies
import {useState, useEffect} from 'react'
import Link from 'next/link'
import {useSession} from 'next-auth/react'
import Button from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/Login';
// local dependencies (project components)
import LogoEscience from './LogoEscience';
import AppMenuItem from './AppMenuItem'
import {menuItems} from '../../config/menuItems'
import {userMenuItems} from '../../config/userMenuItems';
import UserMenu from './UserMenu'

export default function AppHeader(){
  const [activePath, setActivePath] = useState("/")
  const {data, status} = useSession()

  useEffect(()=>{
    // set activePath to currently loaded route/page
    if (typeof window !='undefined'){
      const paths = window.location.pathname.split("/")
      if (paths.length > 0) setActivePath(`/${paths[1]}`)
    }
  },[])

  function getMenuItems(){
    return menuItems.map(item=>{
      // set active flag to menu item
      item.active = activePath === item.path
      return (
        <AppMenuItem
          key={item.path}
          item={item}
        />
      )
    })
  }

  function getLoginButton(){
    if (status==="loading"){
      return null
    }

    if (status==="authenticated"){
      // when user authenticated
      // we show user menu with the avatar and user specific options
      return (
        <UserMenu
          name={`${data?.name ?? "No Name"}`}
          menuOptions={userMenuItems}
        />
      )
    }

    return (
      <Link href="/login" passHref>
        <Button
          variant="text"
          >
          <LoginIcon />
          <span className="ml-4">Sign In</span>
        </Button>
      </Link>
    )
  }

  return (
    <header className="px-4 lg:container lg:mx-auto">
      <div className="flex flex-col items-center pt-4 md:flex-row">
        <Link href="/" passHref>
          <a><LogoEscience className="cursor-pointer"/></a>
        </Link>
        <section className='flex flex-1 py-4'>
          <div className="flex justify-center items-center flex-1">
            {getMenuItems()}
          </div>
          <div className="min-w-[9rem] text-right">
            {getLoginButton()}
          </div>
        </section>
      </div>
    </header>
  )
}