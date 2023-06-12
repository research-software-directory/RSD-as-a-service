// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import MainContent from './MainContent'

export default function DefaultLayout({children}:{children:ReactNode}) {
  return (
    <>
      <AppHeader />
      <MainContent>
        {children}
      </MainContent>
      {/* <main className="flex-1 flex flex-col px-4 lg:container lg:mx-auto">
        {children}
      </main> */}
      <AppFooter/>
    </>
  )
}
