// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {app} from '~/config/app'
// import {getHomepageCounts} from '~/components/home/getHomepageCounts'
// import HelmholtzHome from '~/components/home/helmholtz'
// import RsdHome,{RsdHomeProps} from '~/components/home/rsd'
import PageMeta from '~/components/seo/PageMeta'
import DefaultLayout from '~/components/layout/DefaultLayout'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
// import useRsdSettings from '~/config/useRsdSettings'

const pageTitle = `Home | ${app.title}`
const pageDesc = 'The Research Software Directory is designed to show the impact research software has on research and society. We stimulate the reuse of research software and encourage proper citation of research software to ensure researchers and RSEs get credit for their work.'

export default function Home() {
  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
      <DefaultLayout>
        <ContentInTheMiddle>
            <h1>Core homepage is not used. It will be replaced by home-ui module.</h1>
        </ContentInTheMiddle>
      </DefaultLayout>
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
// export async function getServerSideProps() {
//   // get counts for default rsd home page
//   const counts = await getHomepageCounts()
//   // get host information for home page
//   const host = process.env.RSD_HOST ?? 'rsd'
//   // provide props to home component
//   return {
//     props: {
//       counts
//     },
//   }
// }
