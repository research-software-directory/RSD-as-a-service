// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

import {Provider} from '~/auth/api/getLoginProviders'
import useRsdSettings from '~/config/useRsdSettings'
import LoginProviders from './LoginProviders'

type LoginDialogProps = Readonly<{
  providers: Provider[]
  open:boolean,
  onClose:()=>void
}>

export default function LoginDialog({providers,open, onClose}: LoginDialogProps) {
  const {host} = useRsdSettings()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

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
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <LoginProviders
          providers={providers}
          login_info_url={host.login_info_url}
          onClick={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
