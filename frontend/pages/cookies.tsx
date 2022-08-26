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
        Cookies are stored on the user&apos;s computer, from where they are
        sent to our website. This means that users have full control over the
        use of cookies. Users can deactivate or restrict the transmission of
        cookies by changing their web browser cookie settings. Any cookies already
        stored can be deleted at any time. This can also be effected
        automatically.
      </p>

      <h2 className="mb-4">Functional cookies</h2>

      <p className="mb-8">
        These cookies are necessary for the website to function and cannot be switched off.
        They are only set in response to actions made by you which amount to a request for services, such as
        setting your privacy preferences, logging in or filling in forms. You can set your browser to block
        or alert you about these cookies, but some parts of the site will not work properly.
      </p>

      { /* Matomo specific section */ }
      <MatomoTracking
        matomoId={matomoId}
        matomoConsent={matomoConsent}
      />

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
