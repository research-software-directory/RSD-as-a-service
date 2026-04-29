// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Diego Alonso Alvarez (Imperial College London) <d.alonso-alvarez@imperial.ac.uk>
// SPDX-FileCopyrightText: 2026 Diego Alonso Alvarez (ICL) <d.alonso-alvarez@imperial.ac.uk>
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (NLEsc) <d.mijatovic@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Imperial College London
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Image from 'next/image'

import {HomeProps} from '~/app/page'
import {useSession} from '~/auth/AuthProvider'
import MainContent from '~/components/layout/MainContent'
import ContentLoader from '~/components/layout/ContentLoader'
import useImperialData from './useImperialData'
import CounterBox from './CounterBox'
import Keywords from './Keywords'

export default function ImperialCollegeHome({counts,news}: HomeProps) {
  const {token} = useSession()
  const {loading, keywords} = useImperialData(token)

  return (
    <MainContent className="flex-1 flex flex-col text-secondary-content bg-[url('/images/imperial_bg.png')] bg-cover bg-no-repeat bg-center bg-scroll bg-base-100">
      <>
        {/* Information banner */}
        <div className="max-w-(--breakpoint-xl) mx-auto p-4  grid lg:grid-cols-[1fr_1fr] gap-8 md:gap-10 lg:my-10 md:px-10">
          <div className="flex flex-col justify-center">
            <Image
              src="/images/imperial-college-logo-body.svg"
              width="722"
              height="170"
              alt="Imperial College London logo"
              priority
            />
            <h1 className="mt-8 text-4xl xl:text-5xl font-rsd-titles font-bold">
              The gateway to Imperial software
            </h1>
            <div className="mt-8 text-lg">
              Software plays an increasingly important role in research. Despite this,
              it can be difficult to promote and showcase software through traditional
              academic means. The Imperial Research Software Directory provides a
              place to tell the world about your research software. Do you develop
              software at Imperial? Add your package to the directory!
            </div>
          </div>
        </div>
  
        {/* Counters */}
        <div className="max-w-(--breakpoint-xl) mx-auto flex flex-wrap justify-between gap-10 md:gap-16 p-5 md:p-10 ">
          <h2 className="sr-only">Statistics</h2>
          <CounterBox
            label="Software Submissions"
            value={counts.software_cnt?.toString() ?? ''}
          />
          <CounterBox
            label="Software Mentions"
            value={counts.software_mention_cnt?.toString() ?? ''}
          />
        </div>
  
        {/* Keywords */}
        {
          loading ?
            <ContentLoader />
            :
            <div className="mb-12">
              <Keywords keywords={keywords} />
            </div>
        }
      </>
    </MainContent>
  )
}
