// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import MainContent, {MainContainerProps} from './MainContent'

/**
 * Main layout to be used on most pages. It contains of AppHeader, MainContent and AppFooter components.
 * It creates header, main and footer html elements.
 * It is based on styles defined on the body element in the root layout.tsx
 * All props (className, children, ...props) are passed to MainContent component (main html element).
 * @param param0
 * @returns
 */
export default function MainLayout({className, children, ...props}: MainContainerProps) {
  return (
    <>
      <AppHeader />
      <MainContent className={className} {...props}>
        {children}
      </MainContent>
      <AppFooter/>
    </>
  )
}
