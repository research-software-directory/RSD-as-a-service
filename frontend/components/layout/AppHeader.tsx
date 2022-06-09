// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// external dependencies
import {useState, useEffect} from 'react'
import Link from 'next/link'
import {useAuth} from '../../auth'
// local dependencies (project components)
import LogoRSD from '~/components/svg/LogoRSD'
import AppMenuItem from './AppMenuItem'
import {menuItems} from '../../config/menuItems'
import AddMenu from './AddMenu'
import LoginButton from '~/components/login/LoginButton'

import JavascriptSupportWarning from './JavascriptSupportWarning'
{/*// import ThemeSwitcher from '~/components/layout/ThemeSwitcher'*/}

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

  return (
    <header className="px-4 lg:container lg:mx-auto">
      <div className="flex flex-col pt-4 pb-6 md:flex-row md:items-center">
        <Link href="/" passHref>
          <a><LogoRSD className="cursor-pointer scale-90 sm:scale-100"/></a>
        </Link>
        <section className="flex flex-1 text-lg">
          <div className="flex flex-1 md:justify-center md:items-center">
            {getMenuItems()}
          </div>
          <JavascriptSupportWarning />
          <div className="flex-1 flex justify-end items-center min-w-[8rem] text-right sm:flex-none">
            {editButton ? editButton : null}
            {status==='authenticated' ? <AddMenu/> : null}
            {/*<ThemeSwitcher/>*/}
            <LoginButton/>
          </div>
        </section>
      </div>
    </header>
  )
}
