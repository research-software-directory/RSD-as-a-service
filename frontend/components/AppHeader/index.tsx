// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useEffect, MouseEvent} from 'react'
import {IconButton, Menu, MenuItem} from '@mui/material'
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
import FeedbackPanelButton from '~/components/feedback/FeedbackPanelButton'

export default function AppHeader({editButton}: { editButton?: JSX.Element }) {
  const [activePath, setActivePath] = useState('/')
  const {session} = useAuth()
  const status = session?.status || 'loading'
  const {host, embedMode} = useRsdSettings()
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
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <header
      data-testid="app-header"
      className="z-10 py-4 min-h-[6rem] bg-secondary text-primary-content flex flex-col"
    >
      {/* keep these styles in sync with main in MainContent.tsx */}
      <div
        className="flex-1 flex flex-col items-start px-4 lg:flex-row lg:container lg:mx-auto lg:items-center">
        <div className="w-full flex-1 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" passHref>
            <a title="Homepage"
              className="hover:text-inherit">
              <LogoApp className="hidden 2xl:block"/>
              <LogoAppSmall className="block 2xl:hidden"/>
            </a>
          </Link>

          {/* Desktop global search*/}
          <GlobalSearchAutocomplete className="hidden lg:block ml-12 mr-6"/>

          {/* Desktop menu*/}
          <div
            className="justify-center lg:justify-start hidden md:flex text-lg ml-4 gap-5 text-center opacity-90 font-normal flex-1">
            {menuItems.map(item =>
              <Link key={item.path} href={item.path || ''}>
                <a className={`${activePath === item.path ? 'nav-active' : ''}`}>
                  {item.label}
                </a>
              </Link>
            )}
          </div>

          <div
            className="text-primary-content flex gap-2 justify-end items-center min-w-[8rem] text-right ml-4">
            {/* EDIT button */}
            {editButton ? editButton : null}

            {/* ADD menu button */}
            {status === 'authenticated' ? <AddMenu/> : null}

            {/* Mobile menu */}
            <IconButton
              size="large"
              title="Menu"
              data-testid="menu-button"
              aria-label="menu button"
              onClick={handleClick}
              sx={{
                display: ['flex', 'flex', 'none'],
                color: 'primary.contrastText',
                margin: '0rem 0.5rem',
                alignSelf: 'center',
                '&:focus-visible': {
                  outline: 'auto'
                }
              }}
            >
              <MenuIcon/>
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'menu-button'
              }}
              transformOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              // disable adding styles to body (overflow:hidden & padding-right)
              disableScrollLock={true}
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

            {/* LOGIN / USER MENU */}
            <LoginButton/>
          </div>
          <JavascriptSupportWarning />
        </div>
        {/* Mobile global search */}
        <GlobalSearchAutocomplete className="lg:hidden my-4" />
      </div>
      {/* FEEDBACK panel */}
      {host.feedback_email
        ? <FeedbackPanelButton feedback_email={host.feedback_email}/>
        : null
      }
    </header>
  )
}
