// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {app} from '~/config/app'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import {HomeProps} from 'pages/index'

// Custom Imperial College content component
import MainContentImperialCollege from './MainContentImperialCollege'

// Meta tags title and description
const pageTitle = `Home | ${app.title}`
const pageDesc = 'The Research Software Directory is designed to show the impact research software has on research and society. We stimulate the reuse of research software and encourage proper citation of research software to ensure researchers and RSEs get credit for their work.'

/**
 * Main entry point (component) of the custom ImperialCollege homepage example
 */
export default function ImperialCollegeHome({counts}: HomeProps) {
  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
      {/* Canonical url meta tag */}
      <CanonicalUrl />

      {/* CONTENT */}
      <section className="flex-1 flex flex-col text-secondary-content  bg-[url('/images/campus_south_ken.jpg')] bg-contain bg-no-repeat bg-center bg-black bg-scroll">
        {/* shared header component */}
        <AppHeader />
        {/* custom content component */}
        <MainContentImperialCollege counts={counts} />
        {/* shared footer component */}
        <AppFooter/>
      </section>
    </>
  )
}
