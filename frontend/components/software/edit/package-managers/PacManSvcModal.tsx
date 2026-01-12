// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import CloseIcon from '@mui/icons-material/Close'

import useSmallScreen from '~/config/useSmallScreen'
import {PackageManager} from './apiPackageManager'
import PackageMangerIcon from './PackageManagerIcon'
import PacManSvcReport from './PacManSvcReport'
import {PackageManagerSettings, packageManagerSettings} from './config'

type BackgroundServiceModalProps = Readonly<{
  item: PackageManager
  onClose: () => void
  onClear: ({id,data}:{id:string,data:Partial<PackageManager>})=>void
}>

export default function PacManSvcModal({
  item, onClose, onClear
}: BackgroundServiceModalProps
) {
  const smallScreen = useSmallScreen()
  const settings = packageManagerSettings[item?.package_manager ?? 'other'] as PackageManagerSettings

  // console.group('PacManSvcModal')
  // console.log('item...', item)
  // console.log('settings...', settings)
  // console.groupEnd()

  return (
    <Dialog
      data-testid="background-service-modal"
      // use fullScreen modal for small screens
      fullScreen={smallScreen}
      open={true}
      onClose={onClose}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        fontWeight: 500,
        // color: 'var(--rsd-base-content-secondary,#757575)'
      }}>
        <MiscellaneousServicesIcon
          sx={{
            width: '2rem',
            height: '2rem',
            margin: '0rem 0.5rem 0.25rem 0rem'
          }}
        />
        Background services
      </DialogTitle>

      <DialogContent sx={{
        width:['100%','33rem'],
        minHeight:'10rem',
      }}>

        <div className="flex items-center gap-4 py-2 overflow-hidden wrap-anywhere">
          <PackageMangerIcon platform={item.package_manager} />
          {item.url}
        </div>

        <PacManSvcReport
          item={item}
          settings={settings}
          onClear={onClear}
        />

      </DialogContent>
      <DialogActions sx={{
        padding: '1rem 1.5rem',
      }}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          startIcon={
            <CloseIcon />
          }
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
