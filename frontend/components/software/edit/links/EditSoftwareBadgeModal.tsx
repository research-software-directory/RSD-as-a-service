// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import {config} from '~/components/software/edit/links/config'
import {useForm} from 'react-hook-form'
import {addBadgeForSoftware, updateBadgeContent} from '~/components/software/apiSoftware'
import {useSession} from '~/auth/AuthProvider'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useSmallScreen from '~/config/useSmallScreen'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledTextField from '~/components/form/ControlledTextField'


export type EditSoftwareBadgeModalProps = {
  softwareId: string,
  existingBadgeUrls: Set<string>,
  onSave: () => void,
  onCancel: () => void,
  badgeToEdit: EditBadgeFields | null,
}

type BadgeFormFields = {
  badgeUrl: string,
  badgeLink: string | null,
  altText: string | null,
}

export type EditBadgeFields = BadgeFormFields & {
  badgeId: string,
}

export type NewBadgeFields = BadgeFormFields & {
  softwareId: string,
  position: number,
}

export default function EditSoftwareBadgeModal({softwareId, existingBadgeUrls, onSave, onCancel, badgeToEdit}: Readonly<EditSoftwareBadgeModalProps>) {
  const smallScreen = useSmallScreen()
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {watch, getValues, handleSubmit, control, formState: {errors, isValid, isDirty, isSubmitting, isSubmitted}} = useForm<BadgeFormFields>({
    mode: 'onChange',
    defaultValues: {
      badgeUrl: badgeToEdit?.badgeUrl ?? '',
      altText: badgeToEdit?.altText ?? '',
      badgeLink: badgeToEdit?.badgeLink ?? '',
    }
  })
  const enteringNewBadge: boolean = badgeToEdit === null
  const formId = 'badge-form'

  function validateNewUrlNotExistsYet() {
    const badgeUrl = getValues('badgeUrl')
    if (enteringNewBadge) {
      return badgeUrl === null || !existingBadgeUrls.has(badgeUrl) ? true : 'This badge already exists for this software'
    }
    else {
      return badgeUrl === null || badgeUrl === badgeToEdit!.badgeUrl || !existingBadgeUrls.has(badgeUrl) ? true : 'This badge already exists for this software'
    }

  }

  function handleUpdateOrAddBadge({badgeUrl, badgeLink, altText}: BadgeFormFields) {
    if (enteringNewBadge) {
      addBadgeForSoftware(token, {
        softwareId: softwareId,
        badgeUrl: badgeUrl,
        badgeLink: badgeLink,
        position: existingBadgeUrls.size + 1,
        altText: altText,
      })
        .catch((e) => {
          showErrorMessage((e.message))
        })
        .finally(() => onSave())
    } else {
      updateBadgeContent(token, {
        badgeId: badgeToEdit!.badgeId,
        badgeUrl: badgeUrl,
        badgeLink: badgeLink,
        altText: altText,
      })
        .catch((e) => {
          showErrorMessage((e.message))
        })
        .finally(() => onSave())
    }
  }

  function renderDialogTitleText(): string {
    return enteringNewBadge ? 'Add new badge' : 'Update badge'
  }

  return (
    <Dialog open={true} fullScreen={smallScreen}>
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        {renderDialogTitleText()}
      </DialogTitle>
      <form id={formId} onSubmit={handleSubmit(handleUpdateOrAddBadge)} autoComplete='off'>
        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <ControlledTextField
            control={control}
            rules={{...config.badges.badgeUrl.validation, validate: validateNewUrlNotExistsYet}}
            options={{
              name: 'badgeUrl',
              label: config.badges.badgeUrl.label,
              autofocus: true,
              helperTextMessage: errors['badgeUrl']?.message ?? config.badges.badgeUrl.help,
              helperTextCnt: `${watch('badgeUrl')?.length ?? 0}/${config.badges.badgeUrl.validation.maxLength.value}`
            }}
          />
          <ControlledTextField
            control={control}
            rules={{...config.badges.altText.validation, validate: validateNewUrlNotExistsYet}}
            options={{
              name: 'altText',
              label: config.badges.altText.label,
              helperTextMessage: errors['altText']?.message ?? config.badges.altText.help,
              helperTextCnt: `${watch('altText')?.length ?? 0}/${config.badges.altText.validation.maxLength.value}`
            }}
          />
          <ControlledTextField
            control={control}
            rules={{...config.badges.badgeLink.validation, validate: validateNewUrlNotExistsYet}}
            options={{
              name: 'badgeLink',
              label: config.badges.badgeLink.label,
              helperTextMessage: errors['badgeLink']?.message ?? config.badges.badgeLink.help,
              helperTextCnt: `${watch('badgeLink')?.length ?? 0}/${config.badges.badgeLink.validation.maxLength.value}`
            }}
          />
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid',
          borderColor: 'divider',
          flexDirection: 'row-reverse',
          justifyContent: 'flex-start',
          gap:'1rem',
        }}>
          <SubmitButtonWithListener
            formId={formId}
            disabled={!isValid || isSubmitting || isSubmitted || !isDirty}
          />
          <Button
            onClick={() => onCancel()}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
