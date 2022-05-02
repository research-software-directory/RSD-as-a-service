import {useState} from 'react'
import Link from 'next/link'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'

import {useAuth} from '~/auth'
import useLoginProviders from '~/auth/api/useLoginProviders'
import {userMenuItems} from '~/config/userMenuItems'
import UserMenu from '~/components/layout/UserMenu'

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
    // we show user menu with the avatar and user specific options
    return (
      <UserMenu
        name='No Name'
        menuOptions={userMenuItems}
      />
    )
  }
  // when there is only 1 provider we
  // link redirect directly yo Sign in button
  if (providers && providers.length === 1) {
    return (
      <Link
        href={providers[0].redirectUrl}
        passHref
      >
        <a>
          Sign in
        </a>
      </Link>
    )
  }
  // when there are multiple providers
  // we show modal with the list of login options
  if (providers && providers.length > 1) {
    return (
       <div>
        <a onClick={handleClickOpen}>
          Sign in
        </a>
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
                  <a className=" w-full hover:bg-black hover:text-white transition font-bold py-2 px-4 rounded-full border outline-1">
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
