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

import useSmallScreen from '~/config/useSmallScreen'
import {config} from '~/components/software/edit/links/config'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledTextField from '~/components/form/ControlledTextField'
import validateImageSrc from '~/utils/validateImageSrc'

export type EditSoftwareBadgeModalProps = Readonly<{
  existingBadgeUrls: Set<string>,
  onSave: (badge:EditBadgeFields) => void,
  onCancel: () => void,
  badgeToEdit?: EditBadgeFields,
}>

export type BadgeFormFields = {
  badgeUrl: string | null,
  badgeLink: string | null,
  altText: string | null,
}

export type EditBadgeFields = BadgeFormFields & {
  badgeId: string | null,
}

export type NewBadgeFields = BadgeFormFields & {
  softwareId: string,
  position: number,
}

const formId = 'badge-form'

export default function EditSoftwareBadgeModal({existingBadgeUrls,badgeToEdit,onSave,onCancel}: EditSoftwareBadgeModalProps) {
  const smallScreen = useSmallScreen()
  const {watch, register, handleSubmit, control, formState: {errors, isValid, isDirty, isSubmitting, isSubmitted}} = useForm<EditBadgeFields>({
    mode: 'onChange',
    defaultValues: {
      ...badgeToEdit
    }
  })
  // if badgeId present we edit badge
  const modalTitle = badgeToEdit?.badgeId ? 'Edit badge' : 'Add badge'

  async function validateBadgeUrl(badgeUrl:string|null) {
    if (badgeUrl){
      // check if url already exists in other badges
      if (existingBadgeUrls.has(badgeUrl) && badgeUrl !== badgeToEdit?.badgeUrl){
        return 'This badge already exists for this software'
      }
      // check badge url returns valid image
      const isImage = await validateImageSrc(badgeUrl)
      // debugger
      if (!isImage){
        return 'The URL does not point to a valid, viewable image file'
      }
      return true
    }
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
        {modalTitle}
      </DialogTitle>
      <form id={formId} onSubmit={handleSubmit(onSave)} autoComplete='off'>
        {/* hidden input for badgeId, null when new badge */}
        <input type="hidden"
          {...register('badgeId')}
        />
        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <ControlledTextField
            control={control}
            rules={{
              ...config.badges.badgeUrl.validation,
              // add dynamic url validation
              validate: validateBadgeUrl
            }}
            options={{
              name: 'badgeUrl',
              label: config.badges.badgeUrl.label,
              autofocus: true,
              useNull: true,
              helperTextMessage: errors['badgeUrl']?.message ?? config.badges.badgeUrl.help,
              helperTextCnt: `${watch('badgeUrl')?.length ?? 0}/${config.badges.badgeUrl.validation.maxLength.value}`
            }}
          />
          <ControlledTextField
            control={control}
            rules={config.badges.altText.validation}
            options={{
              name: 'altText',
              label: config.badges.altText.label,
              useNull: true,
              helperTextMessage: errors['altText']?.message ?? config.badges.altText.help,
              helperTextCnt: `${watch('altText')?.length ?? 0}/${config.badges.altText.validation.maxLength.value}`
            }}
          />
          <ControlledTextField
            control={control}
            rules={config.badges.badgeLink.validation}
            options={{
              name: 'badgeLink',
              label: config.badges.badgeLink.label,
              useNull: true,
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
            onClick={onCancel}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
