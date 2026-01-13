// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect} from 'react'
import AOS from 'aos'

import {HomeProps} from '~/app/page'
import Arc from './arc.svg'
import AboutUsSection from './AboutUsSection'
import LogoSection from './LogoSection'
import LearnMoreSection from './LearnMoreSection'
import OurGoalsSection from './OurGoalsSection'
import GetStartedSection from './GetStartedSection'
import StatsSection from './StatsSection'
import JumboBanner from './JumboBanner'
import TopNewsSection from './TopNewsSection'
import HomepageDivider from './HomepageDivider'

/*! purgecss start ignore */
import 'aos/dist/aos.css'

export default function RsdHome({counts,news}: HomeProps) {
  // Initialize AOS library
  useEffect(() => {
    AOS.init({offset: 16})
  }, [])

  return (
    <main className="bg-base-100 dark:bg-base-900 dark:text-base-100" data-testid="rsd-home-page">
      {/* Jumbo Banner  */}
      <JumboBanner />

      {/* stats  */}
      <StatsSection
        software_cnt={counts?.software_cnt ?? null}
        project_cnt={counts?.project_cnt ?? null}
        organisation_cnt={counts?.organisation_cnt ?? null}
        contributor_cnt={counts?.contributor_cnt ?? null}
        software_mention_cnt={counts?.software_mention_cnt ?? null}
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
      </div >
    </main >
  )
}
