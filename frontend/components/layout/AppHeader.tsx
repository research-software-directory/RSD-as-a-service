// external dependencies
import {useState, useEffect} from 'react'
import Link from 'next/link'
import {useAuth} from '../../auth'
import Button from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/Login'
// local dependencies (project components)
import LogoEscience from './LogoEscience'
import AppMenuItem from './AppMenuItem'
import {menuItems} from '../../config/menuItems'
import {userMenuItems} from '../../config/userMenuItems'
import UserMenu from './UserMenu'
import AddMenu from './AddMenu'

import {getRedirectUrl} from '../../utils/surfConext'
import JavascriptSupportWarning from './JavascriptSupportWarning'

export default function AppHeader({editButton}:{editButton?:JSX.Element}){
  const [activePath, setActivePath] = useState('/')
  const {session} = useAuth()
  const status = session?.status || 'loading'

  useEffect(()=>{
    // set activePath to currently loaded route/page
    if (typeof window !='undefined'){
      const paths = window.location.pathname.split('/')
      if (paths.length > 0) setActivePath(`/${paths[1]}`)
    }
  }, [])

  async function redirectToSurf(){
    const url = await getRedirectUrl('surfconext')
    console.log('redirectToSurf...',url)
    debugger
    if (url){
      window.location.href = url
    }
  }

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
    if (status==='loading'){
      return null
    }

    if (status==='authenticated'){
      // when user authenticated
      // we show user menu with the avatar and user specific options
      return (
        <UserMenu
          name='No Name'
          menuOptions={userMenuItems}
        />
      )
    }

    return (
      // <Link href="/login" passHref>
        <Button
          variant="text"
          onClick={redirectToSurf}
          sx= {{
            textTransform:'inherit'
          }}
        >
          <LoginIcon />
          <span className="ml-4">Sign In</span>
        </Button>
      // </Link>
    )
  }

  return (
    <header className="px-4 lg:container lg:mx-auto">
      <div className="flex flex-col pt-4 md:flex-row md:items-center">
        <Link href="/" passHref>
          <a><LogoEscience className="cursor-pointer scale-90 sm:scale-100"/></a>
        </Link>
        <section className='flex flex-1 py-4'>
          <div className="flex flex-1 md:justify-center md:items-center">
            {getMenuItems()}
          </div>
          <JavascriptSupportWarning />
          <div className="flex-1 min-w-[8rem] text-right sm:flex-none">
            {editButton ? editButton : null}
            {status==='authenticated' ? <AddMenu/> : null}
            {getLoginButton()}
          </div>
        </section>
      </div>
    </header>
  )
}
