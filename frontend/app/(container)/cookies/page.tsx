import {Metadata} from 'next'
import {cookies} from 'next/headers'

import {app} from '~/config/app'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import PageTitle from '~/components/layout/PageTitle'
import MatomoTracking from '~/components/cookies/MatomoTracking'

const pageTitle = `Cookies | ${app.title}`
const description = `
  Cookies are small blocks of data created by our website and stored by your web browser on your computer.
  Using cookies allows our website to store information between your visits. You have full control over
  these cookies and can deactivate or restrict them by changing your web browser&apos;s cookie settings.
  Any cookies already stored can be deleted at any time. This may limit the functionality of our website,
  however.
`
export const metadata: Metadata = {
  title: pageTitle,
  description: description
}

export default async function CookiesPage(){
  const cookieStore = await cookies()
  const mtm_consent = cookieStore.get('mtm_consent')?.value
  const mtm_consent_removed = cookieStore.get('mtm_consent_removed')?.value

  let matomoConsent:boolean|null = null
  if (mtm_consent){
    matomoConsent = true
  } else if (mtm_consent_removed){
    matomoConsent = false
  }

  const matomoId = process.env.MATOMO_ID || null

  // console.group('CookiesPage')
  // console.log('mtm_consent...', mtm_consent)
  // console.log('mtm_consent_removed...', mtm_consent_removed)
  // console.log('matomoConsent...', matomoConsent)
  // console.log('matomoId...', matomoId)
  // console.groupEnd()

  return(
    <BaseSurfaceRounded className="min-h-[55rem] p-4 bg-base-100 rounded-lg xl:w-[64rem] lg:mx-auto lg:mt-12 lg:px-20 lg:pb-12 ">
      <PageTitle title="Cookies" />
      <p className="mb-4">
        {description}
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
    </BaseSurfaceRounded>
  )
}
