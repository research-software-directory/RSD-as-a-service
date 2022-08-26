// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {useState} from 'react'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import {Matomo} from './nodeCookies'
import {useMatomoConsent} from './useCookieConsent'

type CookieConsentMatomoProps = {
  matomo: Matomo,
  route: string
}

/**
 * The CookieConsent component will only open when Matomo is used
 * and matomo cookies (mtm_consent or mtm_consent_removed) are not present
 * @returns
 */
export default function CookieConsentMatomo({matomo, route}: CookieConsentMatomoProps) {
  const {setMatomoConsent} = useMatomoConsent()
  const [open, setOpen] = useState((matomo.id!==null && matomo.consent === null && route!=='/cookies'))

  // console.group('CookieConsentModal')
  // console.log('matomo...', matomo)
  // console.log('route...', route)
  // console.log('open...', open)
  // console.groupEnd()

  // do not render if matomo is not used
  if (matomo.id === null) return null
  // do not render on cookies page (page uses MatomoTracking component)
  if (route==='/cookies') return null
  // do not render if user already answered consent question
  if (matomo.id && matomo.consent!==null) return null

  return (
    <Backdrop
      data-testid="cookie-consent-matomo"
      open={open}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        zIndex:99
      }}
    >
      <Box
        component="section"
        sx={{
          width: '100%',
          display: 'flex',
          backgroundColor: 'secondary.light'
        }}
      >
        <Box
          component="div"
          className="flex-1 lg:container lg:mx-auto"
          sx={{
            display: ['block','grid'],
            gridTemplateColumns:'1fr 16rem',
            padding: '2rem 1rem',
            margin: ['1rem','auto'],
            backgroundColor: 'secondary.light',
            color: 'primary.contrastText',
          }}
        >
          <p>
            We use cookies that are necessary for the basic functionality of our
            website so that it can be continuously optimized for you and its
            user-friendliness improved. We also use the Matomo web analysis tool,
            which tracks data anonymously. This enables us to statistically evaluate
            the use of our website. Your consent to the use of Matomo can be revoked
            at any time via the <u><Link
              className="text-primary hover:text-secondary"
              href="/cookies"
              passHref
            >
              <a>cookies page</a>
            </Link></u>.
          </p>
          <nav className='flex pt-8 items-start justify-around md:pl-4 md:pt-0'>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setMatomoConsent(true)
                setOpen(false)
              }}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setMatomoConsent(false)
                setOpen(false)
              }}
            >
              Decline
            </Button>
          </nav>
        </Box>
      </Box>
    </Backdrop>
  )
}
