// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import {config} from '~/components/software/edit/links/config'
import {useForm} from 'react-hook-form'
import {addBadgeForSoftware, updateBadgeContent} from '~/components/software/apiSoftware'
import {useSession} from '~/auth/AuthProvider'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import useSnackbar from '~/components/snackbar/useSnackbar'


export type EditSoftwareBadgeModalProps = {
  softwareId: string,
  existingBadgeUrls: Set<string>,
  onSave: () => void,
  onCancel: () => void,
  badgeToEdit: EditBadgeFields | null,
}

type NewBadgeFields = {
  badgeUrl: string,
  badgeLink: string | null,
}

type EditBadgeFields = NewBadgeFields & {
  badgeId: string,
}

export default function EditSoftwareBadgeModal({softwareId, existingBadgeUrls, onSave, onCancel, badgeToEdit}: Readonly<EditSoftwareBadgeModalProps>) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {register, getValues, handleSubmit, formState: {errors, isValid, isSubmitting, isSubmitted}} = useForm<NewBadgeFields>({
    mode: 'onChange',
  })
  const enteringNewBadge: boolean = badgeToEdit === null

  function validateNewUrlNotExistsYet() {
    const badgeUrl = getValues('badgeUrl')
    if (enteringNewBadge) {
      return badgeUrl === null || !existingBadgeUrls.has(badgeUrl) ? true : 'This badge already exists for this software'
    }
    else {
      return badgeUrl === null || badgeUrl === badgeToEdit!.badgeUrl || !existingBadgeUrls.has(badgeUrl) ? true : 'This badge already exists for this software'
    }

  }

  function handleUpdateOrAddBadge() {
    if (enteringNewBadge) {
      addBadgeForSoftware(token, {
        software: softwareId,
        badge_url: getValues('badgeUrl')!,
        link_url: getValues('badgeLink'),
        position: existingBadgeUrls.size,
      })
        .catch((e) => {
          showErrorMessage((e.message))
        })
        .finally(() => onSave())
    } else {
      updateBadgeContent(token, badgeToEdit!.badgeId, getValues('badgeUrl'), getValues('badgeLink'))
        .catch((e) => {
          showErrorMessage((e.message))
        })
        .finally(() => onSave())
    }
  }

  function renderAddButtonText(): string {
    if (isSubmitting) {
      return 'Saving'
    } else {
      return enteringNewBadge ? 'Add badge' : 'Update badge'
    }
  }

  return (
    <Dialog open={true}>
      <DialogTitle>
        Add new badge
      </DialogTitle>
      <form onSubmit={handleSubmit(handleUpdateOrAddBadge)} autoComplete='off'>
        <DialogContent>
          <TextField
            autoFocus={true}
            {...register('badgeUrl', {...config.badges.validation.badgeUrl, validate: validateNewUrlNotExistsYet})}
            defaultValue={enteringNewBadge ? '' : badgeToEdit!.badgeUrl}
            fullWidth
            margin='normal'
            label={'URL of the image of the badge'}
            error={!!errors.badgeUrl}
            helperText={errors.badgeUrl?.message}
            required={true}
          >
          </TextField>
          <TextField
            {...register('badgeLink', {...config.badges.validation.badgeLink})}
            defaultValue={enteringNewBadge ? null : badgeToEdit!.badgeLink}
            fullWidth
            margin='normal'
            label={'Optional link of the badge'}
            error={!!errors.badgeLink}
            helperText={errors.badgeLink?.message}
            required={false}
          >
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            disabled={!isValid || isSubmitting || isSubmitted}
            type='submit'
          >
            {renderAddButtonText()}
          </Button>
          <Button
            variant='outlined'
            onClick={() => onCancel()}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
