// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// external dependencies
import {useState, useEffect, ReactChildren} from 'react'
import Link from 'next/link'
import {useAuth} from '../../auth'
// local dependencies (project components)
import {menuItems} from '../../config/menuItems'
import AddMenu from './AddMenu'
import LoginButton from '~/components/login/LoginButton'

import JavascriptSupportWarning from './JavascriptSupportWarning'
import LogoApp from '~/assets/LogoApp.svg'
import LogoAppSmall from '~/assets/LogoAppSmall.svg'
// import ThemeSwitcher from '~/components/layout/ThemeSwitcher'
import {useRouter} from 'next/router'
import {Button, Menu, MenuItem} from '@mui/material'

export default function AppHeader({editButton}: { editButton?: JSX.Element }) {
  const [activePath, setActivePath] = useState('/')
  const {session} = useAuth()
  const status = session?.status || 'loading'
  const router = useRouter()
  useEffect(() => {
    // set activePath to currently loaded route/page
    if (typeof window != 'undefined') {
      const paths = window.location.pathname.split('/')
      if (paths.length > 0) setActivePath(`/${paths[1]}`)
    }
  }, [])

  // Responsive menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <header
      data-testid="Landing Page"
      className="z-10 px-5 md:px-10 min-h-[88px] bg-secondary text-white flex items-center flex-wrap"
    >
      <div className="w-full max-w-screen-2xl mx-auto flex py-3 items-center">


        <Link href="/" passHref>
          <a className="hover:shadow-2xl">
            <LogoApp className="hidden xl:block"/>
            <LogoAppSmall className="block xl:hidden"/>
          </a>
        </Link>


        {/* Large menu*/}
        <div className="flex flex-1">
          <div
            className="hidden sm:flex text-lg ml-6 md:ml-28 gap-5 text-center opacity-90 font-normal">
            {menuItems.map(item =>
              <Link key={item.path} href={item.path || ''}>
                <a className={`${activePath === item.path && 'nav-active'}`}>
                  {item.label}
                </a>
              </Link>)}
          </div>
        </div>

        <JavascriptSupportWarning/>

        {/* Responsive menu items*/}
        <div className="block sm:hidden ml-6 ">
          <Button
            color="inherit"
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}

          >
            Pages ▾
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {menuItems.map(item =>
              <MenuItem onClick={handleClose} key={item.path}>
                <Link href={item.path || ''}>
                  <a className={`${activePath === item.path && 'nav-active'}`}>
                    {item.label}
                  </a>
                </Link>
              </MenuItem>)}
          </Menu>
        </div>
        <div className="flex flex-nowrap">
          {editButton ? editButton : null}
          {status === 'authenticated' ? <AddMenu/> : null}
          {/*<ThemeSwitcher/>*/}
          <LoginButton/>
        </div>
      </div>
    </header>
  )
}
