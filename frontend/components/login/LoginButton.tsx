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
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'

import {useAuth} from '~/auth'
import useLoginProviders from '~/auth/api/useLoginProviders'
import {getUserMenuItems} from '~/config/userMenuItems'
import UserMenu from '~/components/layout/UserMenu'
import CaretIcon from '~/components/icons/caret.svg'

export default function LoginButton() {
  const providers = useLoginProviders()
  const {session} = useAuth()
  const status = session?.status || 'loading'
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  /* Sign in dialog */
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
        <CaretIcon className="-ml-2"/>
      </>
    )
  }
  // when there is only 1 provider we
  // link redirect directly to Sign in button
  if (providers && providers.length === 1) {
    return (
      <Link
        href={providers[0].redirectUrl}
        passHref
      >
        <a className="whitespace-nowrap ml-2" tabIndex={0} >
          Sign in
        </a>
      </Link>
    )
  }
  // when there are multiple providers
  // we show modal with the list of login options
  if (providers && providers.length > 1) {
    return (
      <div className="whitespace-nowrap ml-2">
        <button onClick={handleClickOpen} tabIndex={0}>
          Sign in
        </button>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Sign in with
          </DialogTitle>

          <DialogContent>
            <span className="italic text-gray-600">
              Somewhere, something incredible is waiting to be known.
            </span> <br/> Carl Sagan
            <div className="flex flex-col gap-3 my-8">
            {providers.map(provider => {
              return (
                <Link
                  key={provider.redirectUrl}
                  href={provider.redirectUrl}
                  passHref
                >
                  <a className=" w-full hover:bg-black hover:text-primary-content transition font-bold py-2 px-4 rounded-full border outline-1">
                    {provider.name}
                  </a>
                </Link>
              )
            })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
  return null
}
