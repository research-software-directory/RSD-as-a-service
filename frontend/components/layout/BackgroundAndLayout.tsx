// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import MainContent from './MainContent'
import PageBackground from './PageBackground'

export default function BackgrounAndLayout({children}:{children:ReactNode}) {
  return (
    <>
      <AppHeader />
      <PageBackground>
        <MainContent className="px-4 lg:container lg:mx-auto">
          {children}
        </MainContent>
      </PageBackground>
      <AppFooter/>
    </>
  )
}
