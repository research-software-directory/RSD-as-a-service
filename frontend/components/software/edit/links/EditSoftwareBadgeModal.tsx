// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
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
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledTextField from '~/components/form/ControlledTextField'
import useSmallScreen from '~/config/useSmallScreen'
import isRealImage from '~/utils/isRealImage'
import {useState} from 'react'
import CircularProgress from '@mui/material/CircularProgress'

export type EditSoftwareBadgeModalProps = Readonly<{
  softwareId: string,
  existingBadgeUrls: Set<string>,
  badgeToEdit?: NewBadgeFields,
  onCancel: () => void,
  onSave: (data:NewBadgeFields) => void,
}>

// I think one type is sufficient
export type NewBadgeFields = {
  badgeId: string | null,
  badgeUrl: string | null,
  badgeLink: string | null,
}

// I would call it Badge or BadgeProps
// export type BadgeFields = NewBadgeFields & {
//   badgeId: string,
// }

const formId='edit-software-badge-modal'

export default function EditSoftwareBadgeModal({existingBadgeUrls, onSave, onCancel, badgeToEdit}: EditSoftwareBadgeModalProps) {
  // const {token} = useSession()
  // const {showErrorMessage} = useSnackbar()
  const smallScreen = useSmallScreen()
  const {register, getValues, handleSubmit, control, watch,
    formState: {errors, isValid, isDirty, isSubmitting, isSubmitted, isValidating}
  } = useForm<NewBadgeFields>({
    mode: 'onChange',
    defaultValues: badgeToEdit
  })

  // only valid and dirty enables Save button
  const isSaveButtonDisabled = isValid && isDirty ? false : true

  console.group('EditSoftwareBadgeModal')
  console.log('isValid...', isValid)
  console.log('isDirty...', isDirty)
  // isSubmitting and isSubmitted are not required in this approach
  console.log('isSubmitting...', isSubmitting)
  console.log('isSubmitted...', isSubmitted)
  // use this flag for showing spinning circle during async validation
  console.log('isValidating...', isValidating)
  console.log('isSaveButtonDisabled...', isSaveButtonDisabled)
  console.log('errors...', errors)
  console.groupEnd()

  // renamed validateNewUrlNotExistsYet to async validateBadgeUrl
  // and added multiple validations including image
  async function validateBadgeUrl(badgeUrl:string|null) {
    // validate function passed the value into validate function automatically
    // const badgeUrl = getValues('badgeUrl')
    // console.log('badgeUrl...', badgeUrl)
    if (badgeUrl){
      // 1. check if already exists
      if (existingBadgeUrls.has(badgeUrl) && badgeUrl !== badgeToEdit?.badgeUrl){
        return 'This badge already exists for this software'
      }
      // 2. check if the format is structurally a valid URL
      if (!URL.canParse(badgeUrl)) {
        return 'Invalid URL structure'
      }
      // 3. check https protocol
      const url = new URL(badgeUrl)
      if (url.protocol !== 'https:') {
        return 'Must start with https://'
      }
      // 4. check the domain extension
      if (!/\.[a-z]{2,}$/i.test(url.hostname)) {
        return 'Missing a valid domain extension like .com'
      }
      // 5. check badge url returns valid image
      const isValidImage = await isRealImage(badgeUrl)
      if (!isValidImage) {
        return 'The URL does not point to a valid, viewable image file.'
      }
      // else valid
      return true
    }
  }

  // MOVED TO useEditSoftwareBadges.tsx "hook"
  // function handleUpdateOrAddBadge(data:NewBadgeFields) {

  //   if (badgeToEdit?.badgeId && data.badgeUrl){
  //     handleUpdateBadge(token, badgeToEdit!.badgeId, data.badgeUrl, data.badgeLink)

  //       .finally(() => onSave())
  //   }else{
  //     addBadgeForSoftware(token, {
  //       software: softwareId,
  //       badge_url: getValues('badgeUrl')!,
  //       link_url: getValues('badgeLink'),
  //       position: existingBadgeUrls.size,
  //     })
  //       .catch((e) => {
  //         showErrorMessage((e.message))
  //       })
  //       .finally(() => onSave())
  //   }

  // if (enteringNewBadge) {
  //   addBadgeForSoftware(token, {
  //     software: softwareId,
  //     badge_url: getValues('badgeUrl')!,
  //     link_url: getValues('badgeLink'),
  //     position: existingBadgeUrls.size,
  //   })
  //     .catch((e) => {
  //       showErrorMessage((e.message))
  //     })
  //     .finally(() => onSave())
  // } else {
  //   updateBadgeContent(token, badgeToEdit!.badgeId, getValues('badgeUrl'), getValues('badgeLink'))
  //     .catch((e) => {
  //       showErrorMessage((e.message))
  //     })
  //     .finally(() => onSave())
  // }
  // }

  // function renderAddButtonText(): string {
  //   if (isSubmitting) {
  //     return 'Saving'
  //   } else {
  //     return enteringNewBadge ? 'Add badge' : 'Update badge'
  //   }
  // }

  return (
    <Dialog
      open={true}
      fullScreen={smallScreen}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        Badge
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit(onSave)}
        autoComplete='off'
      >
        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* hidden input for badgeId to be have complete data onSubmit */}
          <input type="hidden"
            {...register('badgeId')}
          />
          {/* repository url */}
          <ControlledTextField
            control={control}
            options={{
              name: 'badgeUrl',
              autofocus: true,
              label: config.badges.badgeUrl.label,
              useNull: true,
              defaultValue: badgeToEdit?.badgeUrl ?? null,
              helperTextMessage: errors['badgeUrl']?.message ?? config.badges.badgeUrl.help,
              helperTextCnt: `${getValues('badgeUrl')?.length ?? 0}/${config.badges.badgeUrl.validation.maxLength.value}`,
              endAdornment: isValidating ?
                <CircularProgress data-testid="slug-circular-progress" color="primary" size={32} />
                : undefined
            }}
            rules={{
              ...config.badges.badgeUrl.validation,
              validate: validateBadgeUrl
            }}
          />
          {/* <TextField
            autoFocus={true}
            {...register('badgeUrl', {...config.badges.badgeUrl.validation, validate: validateNewUrlNotExistsYet})}
            defaultValue={enteringNewBadge ? '' : badgeToEdit!.badgeUrl}
            fullWidth
            // margin='normal'
            label="Badge url"
            error={!!errors.badgeUrl}
            helperText={errors.badgeUrl?.message ?? config.badges.badgeUrl.help}
            required={true}
          > */}
          {/* </TextField> */}
          <ControlledTextField
            control={control}
            options={{
              name: 'badgeLink',
              label: config.badges.badgeLink.label,
              useNull: true,
              // autofocus: true,
              defaultValue: badgeToEdit?.badgeLink ?? null,
              helperTextMessage: errors['badgeLink']?.message ?? config.badges.badgeLink.help,
              helperTextCnt: `${getValues('badgeLink')?.length ?? 0}/${config.badges.badgeLink.validation.maxLength.value}`,
              // endAdornment: loading ?
              //   <CircularProgress data-testid="slug-circular-progress" color="primary" size={32} />
              //   : undefined
            }}
            rules={config.badges.badgeLink.validation}
          />
          {/* <TextField
            {...register('badgeLink', {...config.badges.badgeLink.validation})}
            defaultValue={enteringNewBadge ? null : badgeToEdit!.badgeLink}
            fullWidth
            // margin='normal'
            label={'Optional link of the badge'}
            error={!!errors.badgeLink}
            helperText={errors.badgeLink?.message}
            required={false}
          >
          </TextField> */}
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid',
          borderColor: 'divider',
          // Flip button position
          flexDirection: 'row-reverse',
          // Start from right to left
          justifyContent: 'flex-start',
          gap:'1rem'
        }}>
          <SubmitButtonWithListener
            formId={formId}
            disabled={isSaveButtonDisabled}
          />
          <Button
            color="secondary"
            onClick={onCancel}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
