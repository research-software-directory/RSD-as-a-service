// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Diego Alonso Alvarez (Imperial College London) <d.alonso-alvarez@imperial.ac.uk>
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/image'

import {HomeProps} from 'app/page'
import {useSession} from '~/auth/AuthProvider'
import MainContent from '~/components/layout/MainContent'
import ContentLoader from '~/components/layout/ContentLoader'
import useImperialData from './useImperialData'
import CounterBox from './CounterBox'
import Keywords from './Keywords'

export default function MainContentImperialCollege({counts}: HomeProps) {
  const {token} = useSession()
  const {loading, keywords} = useImperialData(token)

  return (
    <MainContent>
      <div className="w-10/12 mx-auto p-5 md:p-10 grid lg:grid-cols-[1fr_1fr] gap-[2rem]">
        <div className="flex flex-col justify-left">
          <Image
            src="/images/imperial-college-logo-body.svg"
            width="361"
            height="85"
            layout="fixed"
            alt="Imperial College London logo"
            priority
          />

          <div className="mt-8 ml-4 text-lg max-w-prose">
            Software plays an increasingly important role in research. Despite this,
            it can be difficult to promote and showcase software through traditional
            academic means. The Imperial Research Software Directory provides a
            place to tell the world about your research software. Do you develop
            software at Imperial? Add your package to the directory!
          </div>
        </div>
      </div>

      <div className="max-w-(--breakpoint-xl) mx-auto flex flex-wrap justify-between gap-10 md:gap-16 p-5 md:p-10 ">
        <CounterBox
          label="Software Submissions"
          value={counts.software_cnt?.toString() ?? ''}
        />
        <CounterBox
          label="Software Mentions"
          value={counts.software_mention_cnt?.toString() ?? ''}
        />
      </div>

      {
        loading ?
          <ContentLoader />
          :
          <div className="mb-12">
            <Keywords keywords={keywords} />
          </div>
      }

    </MainContent>
  )
}
