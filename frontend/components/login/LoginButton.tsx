// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Link from 'next/link'
import {useTheme} from '@mui/material/styles'

import {useAuth} from '~/auth'
import useLoginProviders from '~/auth/api/useLoginProviders'
import {getUserMenuItems} from '~/config/userMenuItems'
import UserMenu from '~/components/layout/UserMenu'
import LoginDialog from './LoginDialog'

export default function LoginButton() {
  const providers = useLoginProviders()
  const {session} = useAuth()
  const status = session?.status || 'loading'
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  /* LoginDialog */
  const handleClickOpen = () => { setOpen(true) }
  const handleClose = () => { setOpen(false) }

  if (status === 'loading') {
    return null
  }

  if (status === 'authenticated') {
    // when user is authenticated
    const menuItems = getUserMenuItems(session.user?.role)
    // we show user menu with the avatar and user specific options
    return (
      <>
        <UserMenu menuOptions={menuItems}/>
      </>
    )
  }

  // when there are multiple providers
  // we show modal with the list of login options
  if (providers && providers.length > 1) {
    return (
      <div className="whitespace-nowrap ml-2">
        <button onClick={handleClickOpen} tabIndex={0} className="rsd-login-buton">
          Sign in
        </button>
        <LoginDialog
          providers={providers}
          open={open}
          onClose={handleClose}
        />
      </div>
    )
  }

  // If there is only 1 provider we
  // link redirect directly to Sign in button
  return (
    <Link
      href={providers[0]?.redirectUrl ?? ''}
      passHref
    >
      <a className="whitespace-nowrap ml-2 rsd-login-button" tabIndex={0}>
        Sign in
      </a>
    </Link>
  )
}
