// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'

import {app} from '~/config/app'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageTitle from '~/components/layout/PageTitle'
import MatomoTracking, {MatomoTrackingProps} from '~/components/cookies/MatomoTracking'
import {getMatomoConsent} from '~/components/cookies/nodeCookies'

const pageTitle = `Cookies | ${app.title}`

export default function Cookies({matomoId,matomoConsent}: MatomoTrackingProps) {
  // console.group('Cookies')
  // console.log('matomoId...', matomoId)
  // console.log('matomoConsent...', matomoConsent)
  // console.groupEnd()
  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <PageTitle title="Cookies" />

      <p className="mb-4">
        Cookies are small blocks of data created by our website and stored by your web browser on your computer.
        Using cookies allows our website to store information between your visits. You have full control over
        these cookies and can deactivate or restrict them by changing your web browser&apos;s cookie settings.
        Any cookies already stored can be deleted at any time. This may limit the functionality of our website,
        however.
      </p>

      <h2 className="mb-4">Functional cookies</h2>

      <p className="mb-8">
        We use several functional cookies that are necessary for our website to function.
        These are used to remember your privacy preferences and if you are logged in to the website. You can set your browser to block these cookies,
        but some parts of the site will not work properly if you do so.
      </p>

      { /* Matomo specific section */ }
      <MatomoTracking
        matomoId={matomoId}
        matomoConsent={matomoConsent}
      />

      <div className="py-8"></div>

    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {matomoConsent} = getMatomoConsent(context.req)
  const matomoId = process.env.MATOMO_ID || null

  // console.group('cookies.getServerSideProps')
  // console.log('matomoId...', matomoId)
  // console.log('matomoConsent...', matomoConsent)
  // console.groupEnd()

  return {
    // pass this to page component as props
    props: {
      matomoId,
      matomoConsent
    }
  }
}
