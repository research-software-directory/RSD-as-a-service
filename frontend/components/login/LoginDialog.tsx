// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import LoginOptions from './LoginOptions'

import useLoginProviders from '~/auth/api/useLoginProviders'

type LoginDialogProps = {
  open:boolean,
  onClose?:()=>void
}

export default function LoginDialog({open, onClose}: LoginDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const providers = useLoginProviders()

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
    >
      <DialogTitle
        id="responsive-dialog-title"
        aria-labelledby="responsive-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:'space-between',
          fontSize: '1.75rem'
        }}
      >
        Sign in with
        { onClose && <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>}
      </DialogTitle>
      <DialogContent>
        <LoginOptions providers={providers} />
      </DialogContent>
    </Dialog>
  )
}
