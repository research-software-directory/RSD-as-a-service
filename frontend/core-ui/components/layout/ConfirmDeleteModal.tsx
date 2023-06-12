// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

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
  body: JSX.Element,
  onCancel: () => void,
  onDelete: () => void
}

export default function ConfirmDeleteModal({
  open = false, title = 'Remove',
  body = <p>Are you sure you want to remove <strong>this item</strong>?</p>,
  onCancel, onDelete}: ConfirmDeleteModalProps
) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  // console.group('DeleteContributorModal')
  // console.log('open...', open)
  // console.log('contributor...', displayName)
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
        fontSize: '1.5rem',
        color: 'secondary.main',
        fontWeight: 500
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
          <section className="min-h-[5rem] text-lg">
            {body}
          </section>
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
        }}>
          <Button
            tabIndex={1}
            onClick={onCancel}
            color="secondary"
            sx={{
              marginRight: '1rem',
            }}
          >
            Cancel
          </Button>
          <Button
            tabIndex={0}
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
        </DialogActions>

    </Dialog>
  )
}
