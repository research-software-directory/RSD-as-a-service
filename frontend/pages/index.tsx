// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {app} from '~/config/app'
import {getHomepageCounts} from '~/components/home/getHomepageCounts'
import HelmholtzHome from '~/components/home/helmholtz'
import ImperialCollegeHome from '~/components/home/imperial'
import RsdHome,{RsdHomeProps} from '~/components/home/rsd'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import useRsdSettings from '~/config/useRsdSettings'
import {TopNewsProps, getTopNews} from '~/components/news/apiNews'

export type HomeProps = {
  news: TopNewsProps[]
  counts: RsdHomeProps
}

const pageTitle = `Home | ${app.title}`
const pageDesc = 'The Research Software Directory is designed to show the impact research software has on research and society. We stimulate the reuse of research software and encourage proper citation of research software to ensure researchers and RSEs get credit for their work.'

export default function Home({counts,news}: HomeProps) {
  const {host} = useRsdSettings()

  // console.group('Home')
  // console.log('counts...', counts)
  // console.log('news...', news)
  // console.groupEnd()

  if (host && host.name) {
    switch (host.name.toLocaleLowerCase()) {
      case 'helmholtz':
        return <HelmholtzHome />
      case 'imperial':
        return <ImperialCollegeHome counts={counts} news={news} />
      default:
        // RSD default homepage
        return (
          <>
            {/* Page Head meta tags */}
            <PageMeta
              title={pageTitle}
              description={pageDesc}
            />
            {/* canonical url meta tag */}
            <CanonicalUrl/>
            <RsdHome {...counts} news={news} />
          </>
        )
    }
  }
  // RSD default home page
  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
      {/* canonical url meta tag */}
      <CanonicalUrl/>
      <RsdHome {...counts} news={news} />
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps() {
  // get counts for default rsd home page
  const [counts,news] = await Promise.all([
    getHomepageCounts(),
    // get top 3 (most recent) news items
    getTopNews(3)
  ])
  // provide props to home component
  return {
    props: {
      counts,
      news
    },
  }
}
