// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'
import AppHeader from '~/components/AppHeader'
import AppFooter from './AppFooter'

export default function DefaultLayout({children}:{children:ReactNode}) {
  return (
    <>
      <AppHeader/>
      <main className="flex flex-col flex-1 px-4 lg:container lg:mx-auto overflow-hidden">
        {children}
      </main>
      <AppFooter/>
    </>
  )
}
