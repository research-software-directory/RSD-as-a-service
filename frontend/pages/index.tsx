// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {app} from '~/config/app'
import {getHomepageCounts} from '~/components/home/getHomepageCounts'
import HelmholtzHome from '~/components/home/helmholtz'
import RsdHome,{RsdHomeProps} from '~/components/home/rsd'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl, {useCanonicalUrl} from '~/components/seo/CanonicalUrl'
import useRsdSettings from '~/config/useRsdSettings'

type HomeProps = {
  counts: RsdHomeProps
}

const pageTitle = `Home | ${app.title}`
const pageDesc = 'The Research Software Directory is designed to show the impact research software has on research and society. We stimulate the reuse of research software and encourage proper citation of research software to ensure researchers and RSEs get credit for their work.'

export default function Home({counts}: HomeProps) {
  const {host} = useRsdSettings()

  // console.log('host...', host)
  if (host && host.name.toLowerCase() === 'helmholtz') {
    return <HelmholtzHome />
  }
  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
      {/* canonical url meta tag */}
      <CanonicalUrl/>
      <RsdHome {...counts} />
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps() {
  // get counts for default rsd home page
  const counts = await getHomepageCounts()
  // get host information for home page
  const host = process.env.RSD_HOST ?? 'rsd'
  // provide props to home component
  return {
    props: {
      counts
    },
  }
}
