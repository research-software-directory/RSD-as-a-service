// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/legacy/image'
import Link from 'next/link'

import {HomeProps} from 'pages'
import CounterBox from './CounterBox'
import Keywords from './Keywords'
import {useSession} from '~/auth'
import {useAuth} from '~/auth'
import useImperialData from './useImperialData'
import useLoginProviders from '~/auth/api/useLoginProviders'
import ContentLoader from '~/components/layout/ContentLoader'
import MainContent from '~/components/layout/MainContent'
import {Provider} from 'pages/api/fe/auth'

function set_location_cookie() {
  // set cookie so that user is bounced to the software submission page
  // after authentication
  document.cookie = 'rsd_pathname=/add/software;path=/auth;SameSite=None;Secure'
}

function submit_software_href(auth_status: string, login_providers: Provider[]) {
  if (auth_status == 'authenticated') {
    return '/add/software'
  }
  return (login_providers[0]?.redirectUrl ?? '')
}

export default function MainContentImperialCollege({counts}: HomeProps) {
  const {token} = useSession()
  const {loading, keywords} = useImperialData(token)
  const {session} = useAuth()
  const providers = useLoginProviders()
  const auth_status = session?.status || 'loading'

  return (
    <MainContent>
      <div className="w-10/12 mx-auto p-5 md:p-10 grid lg:grid-cols-[1fr_1fr] gap-[2rem]">
        <div className="flex flex-col justify-left">
          <Image
            src="/images/imperial-college-logo.svg"
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
        <div className="relative justify-center">
          <div className="bg-secondary text-primary-content p-4 text-center max-w-fit mx-auto rounded-full border-4 border-primary">
            <Link href="/software">
              <div className="text-4xl">Browse Software</div>
            </Link>
          </div>
          <div className="bg-secondary text-primary-content p-4 text-center max-w-fit mx-auto rounded-full border-4 border-primary mt-8">
            <Link
              href={submit_software_href(auth_status, providers)}
              onClick={set_location_cookie}
            >
              <div className="text-3xl">Submit Software</div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-(--breakpoint-xl) mx-auto flex flex-wrap justify-between gap-10 md:gap-16 p-5 md:p-10 ">
        <CounterBox
          label="Open-Source Software"
          value={counts.open_software_cnt.toString()}
        />
        <CounterBox
          label="Closed-Source Software"
          value={(counts.software_cnt - counts.open_software_cnt).toString()}
        />
        <CounterBox
          label="Software Mentions"
          value={counts.software_mention_cnt.toString()}
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
