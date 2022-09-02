// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useEffect} from 'react'
import {Menu, MenuItem} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
// local dependencies (project components)
import {useAuth} from '~/auth'
import {menuItems} from '~/config/menuItems'
import useRsdSettings from '~/config/useRsdSettings'
import AddMenu from './AddMenu'
import LoginButton from '~/components/login/LoginButton'
import JavascriptSupportWarning from './JavascriptSupportWarning'
import LogoApp from '~/assets/LogoApp.svg'
import LogoAppSmall from '~/assets/LogoAppSmall.svg'
import GlobalSearchAutocomplete from '~/components/GlobalSearchAutocomplete'

export default function AppHeader({editButton}: { editButton?: JSX.Element }) {
  const [activePath, setActivePath] = useState('/')
  const {session} = useAuth()
  const status = session?.status || 'loading'
  const {embedMode} = useRsdSettings()
  // Responsive menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    // set activePath to currently loaded route/page
    if (typeof window != 'undefined') {
      const paths = window.location.pathname.split('/')
      if (paths.length > 0) setActivePath(`/${paths[1]}`)
    }
  }, [])

  // Doesn't show the header in embed mode
  if (embedMode) return null

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <header
      data-testid="app-header"
      className="z-10 py-4 min-h-[88px] bg-secondary text-white flex items-center flex-wrap"
    >
      {/* keep these styles in sync with main in MainContent.tsx */}
      <div className="flex-1 flex flex-col items-start px-4 lg:flex-row lg:container lg:mx-auto lg:items-center">
        <div className="w-full flex-1 flex items-center">
          <Link href="/" passHref>
            <a className="hover:text-inherit">
              <LogoApp className="hidden xl:block"/>
              <LogoAppSmall className="block xl:hidden"/>
            </a>
          </Link>
          <GlobalSearchAutocomplete className="hidden md:block ml-12 mr-6"/>
          {/* Large menu*/}
          <div className="hidden lg:flex text-lg ml-4 gap-5 text-center opacity-90 font-normal">
            {menuItems.map(item =>
              <Link key={item.path} href={item.path || ''}>
                <a className={`${activePath === item.path ? 'nav-active' : ''}`}>
                  {item.label}
                </a>
              </Link>)}
          </div>

          <div className="flex flex-1 justify-end items-center text-right ml-4">

            {/* EDIT button */}
            {editButton ? editButton : null}
            {/* ADD menu button */}
            {status === 'authenticated' ? <AddMenu/> : null}


            {/* LOGIN / USER MENU */}
            <LoginButton/>

            {/* Responsive pages menu */}
            <div>

              <div
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) => handleClick(e)}
                className="block lg:hidden whitespace-nowrap ml-4 cursor-pointer"
              >
                <MenuIcon/>
              </div>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'menu-button',
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              >
                {menuItems.map(item =>
                  <MenuItem onClick={handleClose} key={item.path}>
                    <Link href={item.path || ''}>
                      <a className={`${activePath === item.path && 'nav-active'}`}>
                        {item.label}
                      </a>
                    </Link>
                  </MenuItem>
                )}
              </Menu>
            </div>


          </div>
          <JavascriptSupportWarning/>
        </div>
        <GlobalSearchAutocomplete className="md:hidden mt-4"/>
      </div>
    </header>
  )
}
