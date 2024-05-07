// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {app} from '~/config/app'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import {HomeProps} from 'pages/index'

import MainContentImperialCollege from './MainContentImperialCollege'

const pageTitle = `Home | ${app.title}`
const pageDesc = 'The Research Software Directory is designed to show the impact research software has on research and society. We stimulate the reuse of research software and encourage proper citation of research software to ensure researchers and RSEs get credit for their work.'

export default function ImperialCollegeHome({counts,news}: HomeProps) {
  return (
    <>
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
      <CanonicalUrl />

      <section className="flex-1 flex flex-col text-secondary-content  bg-[url('/images/campus_south_ken.jpg')] bg-contain bg-no-repeat bg-center bg-black bg-scroll">
        <AppHeader />
        <MainContentImperialCollege counts={counts} news={news}/>
        <AppFooter/>
      </section>
    </>
  )
}
