// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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
      <AppFooter/>
    </>
  )
}
