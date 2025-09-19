// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import LogoApp from '~/assets/LogoApp.svg'
import LogoAppSmall from '~/assets/LogoAppSmall.svg'
import {useSession} from '~/auth/AuthProvider'
import useRsdSettings from '~/config/useRsdSettings'
import LoginButton from '~/components/login/LoginButton'
import GlobalSearchAutocomplete from '~/components/GlobalSearchAutocomplete'
import FeedbackPanelButton from '~/components/feedback/FeedbackPanelButton'
import AddMenu from './AddMenu'
import JavascriptSupportWarning from './JavascriptSupportWarning'
import ResponsiveMenu from './ResponsiveMenu'
import DesktopMenu from './DesktopMenu'

export default function AppHeader() {
  const {status} = useSession()
  const {host} = useRsdSettings()
  const pathname = usePathname()

  // console.group('AppHeader')
  // console.log('status...',status)
  // console.log('host...',host)
  // console.log('pathname...',pathname)
  // console.groupEnd()

  return (
    <header
      data-testid="app-header"
      className="z-12 py-4 min-h-[88px] bg-secondary text-primary-content flex items-center flex-wrap"
    >
      {/* keep these styles in sync with main in MainContent.tsx */}
      <div
        className="flex-1 flex flex-col px-4 xl:flex-row items-start lg:container lg:mx-auto">
        <div className="w-full flex-1 flex items-center justify-between">
          <Link href="/" passHref className="hover:text-inherit" aria-label="Link to home page">
            <LogoApp
              className="hidden 2xl:block"
              loading='eager'
              // lighthouse audit requires explicit width and height
              width="100%"
              height="1.5rem"
            />
            <LogoAppSmall
              className="2xl:hidden"
              loading='eager'
              // lighthouse audit requires explicit width and height
              width="7rem"
              height="1.5rem"
            />
          </Link>

          {/* Global search for desktop */}
          <GlobalSearchAutocomplete className="hidden xl:block ml-12 mr-6"/>

          {/* Large menu*/}
          <DesktopMenu activePath={pathname ?? '/'}/>

          <div className="text-primary-content flex gap-2 justify-end items-center min-w-[8rem] text-right ml-4">
            {/* FEEDBACK panel */}
            {host.feedback?.enabled
              ? <FeedbackPanelButton
                feedback_email={host.feedback.url}
                issues_page_url={host.feedback.issues_page_url}
                host_label={host.feedback.host_label}
              />
              : null
            }
            {/* ADD menu button */}
            {status === 'authenticated' ? <AddMenu/> : null}
            {/* Responsive menu */}
            <ResponsiveMenu activePath={pathname ?? '/'} />
            {/* LOGIN / USER MENU */}
            <LoginButton/>
          </div>
        </div>

        {/* Global search for tablet & mobile */}
        <GlobalSearchAutocomplete className="xl:hidden mt-4"/>
      </div>
      <JavascriptSupportWarning/>
    </header>
  )
}
