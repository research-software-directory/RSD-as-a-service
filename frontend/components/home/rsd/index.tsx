// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import AOS from 'aos'

import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import {TopNewsProps} from '~/components/news/apiNews'
import Arc from './arc.svg'
import AboutUsSection from './AboutUsSection'
import LogoSection from './LogoSection'
import LearnMoreSection from './LearnMoreSection'
import OurGoalsSection from './OurGoalsSection'
import GetStartedSection from './GetStartedSection'
import StarsSection from './StatsSection'
import JumboBanner from './JumboBanner'
import TopNewsSection from './TopNewsSection'

/*! purgecss start ignore */
import 'aos/dist/aos.css'
import HomepageDivider from './HomepageDivider'

export type RsdHomeProps = {
  software_cnt: number,
  open_software_cnt: number,
  project_cnt: number,
  organisation_cnt: number,
  contributor_cnt: number,
  software_mention_cnt: number,
  news: TopNewsProps[]
}

export default function RsdHome({
  software_cnt, project_cnt, organisation_cnt,
  contributor_cnt, software_mention_cnt,news
}: RsdHomeProps) {
  // Initialize AOS library
  useEffect(() => {
    AOS.init({offset: 16})
  }, [])

  return (
    <div className="bg-base-100 dark:bg-base-900 dark:text-base-100" data-testid="rsd-home-page">
      {/* Header  */}
      <AppHeader />

      {/* Jumbo Banner  */}
      <JumboBanner />

      {/* stats  */}
      <StarsSection
        software_cnt={software_cnt}
        project_cnt={project_cnt}
        organisation_cnt={organisation_cnt}
        contributor_cnt={contributor_cnt}
        software_mention_cnt={software_mention_cnt}
      />

      <div className="bg-base-800">
        {/* Arc separator  */}
        <Arc className="w-full text-base-100 dark:text-base-900 -translate-y-1"></Arc>
        {/* Get started section  */}
        <GetStartedSection />
        {/* Top news items, ONLY if there are some */}
        <TopNewsSection news={news} />
        {/*  Divider  */}
        <HomepageDivider />
        {/* Our Goals Section */}
        <OurGoalsSection />
        {/*  Divider  */}
        <HomepageDivider />
        {/* Learn more section  */}
        <LearnMoreSection />
        {/*  Divider  */}
        <HomepageDivider />
        {/* About us section  */}
        <AboutUsSection />
        {/*  Divider  */}
        <HomepageDivider />
        {/* Logos  */}
        <LogoSection />
        {/* Footer */}
        <div className="mt-20"></div>
        <AppFooter />
      </div >
    </div >
  )
}
