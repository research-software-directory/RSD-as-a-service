// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

import {Provider} from '~/auth/api/getLoginProviders'
import useRsdSettings from '~/config/useRsdSettings'
import useSmallScreen from '~/config/useSmallScreen'
import LoginProviders from './LoginProviders'

type LoginDialogProps = Readonly<{
  providers: Provider[]
  open:boolean,
  onClose:()=>void
}>

export default function LoginDialog({providers,open, onClose}: LoginDialogProps) {
  const {host} = useRsdSettings()
  const smallScreen = useSmallScreen()

  return (
    <Dialog
      fullScreen={smallScreen}
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
          fontSize: '1.75rem',
          borderBottom: '0px',
        }}
      >
        Sign in with
        <IconButton
          aria-label="Close dialog"
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{
        '.MuiDialogTitle-root + &': {
          paddingTop: '0rem',
        },
      }}>
        <LoginProviders
          providers={providers}
          login_info_url={host.login_info_url}
          onClick={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
