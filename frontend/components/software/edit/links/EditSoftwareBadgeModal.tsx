// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useForm} from 'react-hook-form'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'

import useSmallScreen from '~/config/useSmallScreen'
import validateImageSrc from '~/utils/validateImageSrc'
import {config} from '~/components/software/edit/links/config'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledTextField from '~/components/form/ControlledTextField'
import {useSaveDisabledFormState} from '~/components/form/useSaveDisabledFormState'
import {useAsyncFieldValidation} from '~/components/form/useAsyncFieldValidation'

export type EditSoftwareBadgeModalProps = Readonly<{
  existingBadgeUrls: Set<string>
  onSave: (badge: EditBadgeFields) => void
  onCancel: () => void
  badgeToEdit?: EditBadgeFields
}>

export type BadgeFormFields = {
  badgeUrl: string | null
  badgeLink: string | null
  altText: string | null
}

export type EditBadgeFields = BadgeFormFields & {
  badgeId: string | null
}

export type NewBadgeFields = BadgeFormFields & {
  softwareId: string,
  position: number,
}

const formId = 'badge-form'

/**
 * Custom validation function for badgeUrl value where we check
 * if badgeUrl returns valid image url we can load in src property.
 * The custom async validation is needed to avoid react-hook-form validate delay.
 */
async function validateBadgeImage(value: string){
  // check if badge url returns valid image
  const isImage = await validateImageSrc(value)
  if (!isImage) {
    return 'The URL does not point to a valid, viewable badge image'
  }
  return true
}

export default function EditSoftwareBadgeModal({
  existingBadgeUrls,
  badgeToEdit,
  onSave,
  onCancel,
}: EditSoftwareBadgeModalProps) {
  const smallScreen = useSmallScreen()

  const {
    control, formState, watch, register,
    setError, clearErrors, handleSubmit
  } = useForm<EditBadgeFields>({
    mode: 'onChange',
    defaultValues: badgeToEdit,
  })

  const modalTitle = badgeToEdit?.badgeId ? 'Edit badge' : 'Add badge'
  const [badgeUrl, altText, badgeLink] = watch(['badgeUrl', 'altText', 'badgeLink'])
  const {errors} = formState
  // use custom hook for async validation with react-hook-form
  const {isValidating: asyncValidation} = useAsyncFieldValidation<EditBadgeFields>({
    name: 'badgeUrl',
    control,
    setError,
    clearErrors,
    validatorFn: validateBadgeImage
  })
  // combine basic useSaveDisabledFormState and asyncValidation to decide on saveDisabled value
  const syncSaveDisabled = useSaveDisabledFormState(formState)
  const saveDisabled = syncSaveDisabled || asyncValidation
  // pass values required for validation
  const badgeUrlRules = config.badges.badgeUrl.validation({
    existingBadgeUrls,
    ignoreUrl: badgeToEdit?.badgeUrl ?? ''
  })

  return (
    <Dialog open={true} fullScreen={smallScreen}>
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500,
      }}>
        {modalTitle}
      </DialogTitle>
      <form id={formId} onSubmit={handleSubmit(onSave)} autoComplete="off">
        <input type="hidden" {...register('badgeId')} />

        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}>
          <ControlledTextField
            control={control}
            options={{
              name: 'badgeUrl',
              label: config.badges.badgeUrl.label,
              autofocus: true,
              useNull: true,
              helperTextMessage: errors['badgeUrl']?.message ?? config.badges.badgeUrl.help,
              helperTextCnt: `${badgeUrl?.length ?? 0}/${badgeUrlRules.maxLength.value}`,
              // use custom asyncValidation flag for showing busy animation
              endAdornment: asyncValidation ? <CircularProgress size={24} /> : undefined,
            }}
            rules={badgeUrlRules}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'altText',
              label: config.badges.altText.label,
              useNull: true,
              helperTextMessage: errors['altText']?.message ?? config.badges.altText.help,
              helperTextCnt: `${altText?.length ?? 0}/${config.badges.altText.validation.maxLength.value}`
            }}
            rules={config.badges.altText.validation}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'badgeLink',
              label: config.badges.badgeLink.label,
              useNull: true,
              helperTextMessage: errors['badgeLink']?.message ?? config.badges.badgeLink.help,
              helperTextCnt: `${badgeLink?.length ?? 0}/${config.badges.badgeLink.validation.maxLength.value}`
            }}
            rules={config.badges.badgeLink.validation}
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
            disabled={saveDisabled}
          />
          <Button
            onClick={onCancel}
            color='secondary'
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
