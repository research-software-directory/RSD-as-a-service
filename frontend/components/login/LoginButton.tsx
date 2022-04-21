import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'
// import Image from 'next/image'

import {useAuth} from '~/auth'
import {userMenuItems} from '~/config/userMenuItems'
import {getRedirectUrl} from '~/utils/surfConext'
import UserMenu from '~/components/layout/UserMenu'

// import LogoSURF from '~/assets/logos/LogoSURFconext.png'

export default function LoginButton() {
  const {session} = useAuth()
  const status = session?.status || 'loading'

  const [open, setOpen] = React.useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  async function redirectToSurf() {
    const url = await getRedirectUrl('surfconext')
    if (url) {
      window.location.href = url
    }
  }

  /* Sign in dialog */
  const handleClickOpen = () => { setOpen(true) }
  const handleClose = () => { setOpen(false) }

  console.log('LoginButton', process.env.NEXT_PUBLIC_AUTH_PROVIDERS)

  if (status === 'loading') {
    return null
  }
  if (status === 'authenticated') {
    //   // when user authenticated
    //   // we show user menu with the avatar and user specific options
    return (
      <UserMenu name='No Name' menuOptions={userMenuItems} />
    )
  } else {
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
            <button
              onClick={redirectToSurf}
              className="w-full hover:bg-black hover:text-white transition font-bold py-2 px-4 rounded-full border outline-1">
              SurfConext
              {/*<Image src={LogoSURF} alt="Login with SURFconext" width="40" height="auto"/>*/}
            </button>
              <button
                className="w-full hover:bg-black hover:text-white transition font-bold py-2 px-4 rounded-full border outline-1">
                Helmholtz AAI
                {/*<Image src={LogoSURF} alt="Login with SURFconext" width="40" height="auto"/>*/}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}
