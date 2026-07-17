// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {JSX} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningIcon from '@mui/icons-material/Warning'

type ConfirmDeleteModalProps = {
  open: boolean,
  title: string,
  body: JSX.Element | JSX.Element[],
  onCancel: () => void,
  onDelete: () => void,
  // when passed it is used to require additional confirmation
  // to enable delete button
  removeDisabled?: boolean
}


export default function ConfirmDeleteModal({
  open = false, title = 'Remove',
  body = <p>Are you sure you want to remove <strong>this item</strong>?</p>,
  onCancel, onDelete, removeDisabled = false
}: ConfirmDeleteModalProps
) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  // console.group('ConfirmDeleteModal')
  // console.log('open...', open)
  // console.log('actions...', actions)
  // console.groupEnd()
  return (
    <Dialog
      data-testid="confirm-delete-modal"
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={onCancel}
    >
      <DialogTitle sx={{
        color: 'secondary.main'
      }}>
        <WarningIcon
          color="error"
          sx={{
            width: '2rem',
            height: '2rem',
            margin: '0rem 0.5rem 0.25rem 0rem'
          }}
        /> {title}
      </DialogTitle>

      <DialogContent sx={{
        width:['100%','33rem']
      }}>
        <section className="min-h-[5rem] text-lg overflow-hidden wrap-break-word">
          {body}
        </section>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={removeDisabled}
          type="button"
          variant="contained"
          color="error"
          endIcon={
            <DeleteIcon />
          }
          onClick={onDelete}
        >
          Remove
        </Button>
        <Button
          onClick={onCancel}
          color="secondary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
