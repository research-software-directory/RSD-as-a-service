// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useMemo, useState} from 'react'
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
import {createDebounceValidator} from '~/components/form/debounceFormValidator'

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

/**
 * Custom validation function for badgeUrl value where we check
 * - if badgeUrl is already used in another entry
 * - if badgeUrl returns valid image url we can load in src property
 */
async function validateBadgeImage({
  value, lastValidationResult
}:{
  value: string,
  lastValidationResult:{value:string,message:string}
}){
  // baseUrl value from form
  if (!value) return

  if (value === lastValidationResult.value && lastValidationResult.message) {
    // if already checked return message immediately
    // this is needed because validation is triggered
    // onChange from all form inputs (not only badgeUrl)
    // because react-hook-form needs to keep isValid
    // state in sync for all inputs
    return lastValidationResult.message
  }

  // if (existingBadgeUrls.has(value) && value !== badgeToEdit?.badgeUrl){
  //   lastValidationResult.value = value
  //   lastValidationResult.message = 'This badge already exists for this software'
  //   return lastValidationResult.message
  // }

  // console.groupCollapsed('validateBadgeUrl')
  // console.log('Validate badge url...', value)
  // console.log('existingBadgeUrls...', existingBadgeUrls)
  // console.log('ignoreUrl...', ignoreUrl)
  // console.groupEnd()

  // check if badge url returns valid image
  const isImage = await validateImageSrc(value)
  if (!isImage){
    lastValidationResult.value = value
    lastValidationResult.message = 'The URL does not point to a valid, viewable badge image'
    return lastValidationResult.message
  }
}

export default function EditSoftwareBadgeModal({existingBadgeUrls,badgeToEdit,onSave,onCancel}: EditSoftwareBadgeModalProps) {
  const smallScreen = useSmallScreen()
  const {watch, register, handleSubmit, control, formState:{
    errors,isDirty,isSubmitting,isSubmitted,isValid,isValidating
  }} = useForm<EditBadgeFields>({
    mode: 'onChange',
    defaultValues: badgeToEdit
  })
  // if badgeId present we edit badge
  const modalTitle = badgeToEdit?.badgeId ? 'Edit badge' : 'Add badge'
  // use hook to decide if save buttons should be disabled
  const saveDisabled = useSaveDisabledFormState({
    isDirty, isSubmitting, isSubmitted,
    isValid, isValidating
  })
  /**
   * Keep track of the last error message for specific value
   * this is needed because form validation function validateBadgeUrl
   * is called onChange from all inputs in order to keep isValid status
   * for all inputs in the form up to date.
   */
  const [lastValidationResult]=useState({
    value:'',
    message:''
  })
  // create new instance of debouncedValidation
  const asyncBadgeValidation = useMemo(()=>(
    createDebounceValidator(
      validateBadgeImage,{
        lastValidationResult
      },500)
  ),[lastValidationResult])
  // monitor value changes
  const [badgeUrl,altText,badgeLink] = watch(['badgeUrl','altText','badgeLink'])

  // console.groupCollapsed('EditSoftwareBadgeModal')
  // console.log('existingBadgeUrls...',existingBadgeUrls)
  // console.log('badgeToEdit...',badgeToEdit)
  // console.log('isValid...',isValid)
  // console.log('isDirty...',isDirty)
  // console.log('isSubmitting...',isSubmitting)
  // console.log('isSubmitted...',isSubmitted)
  // console.log('isValidating...',isValidating)
  // console.log('saveDisabled...',saveDisabled)
  // console.log('errors...',errors)
  // console.log('badgeUrl...',badgeUrl)
  // console.log('altText...',altText)
  // console.log('badgeLink...',badgeLink)
  // console.log('badgeUrlValidationResult...',badgeUrlValidationResult)
  // console.log('history...',history)
  // console.groupEnd()

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
              validate: {
                duplicateBadge:(value:string)=>{
                  if (value === lastValidationResult.value && lastValidationResult.message) {
                    // if already checked return message immediately
                    // this is needed because validation is triggered
                    // onChange from all form inputs (not only badgeUrl)
                    // because react-hook-form needs to keep isValid
                    // state in sync for all inputs
                    return lastValidationResult.message
                  }
                  if (existingBadgeUrls.has(value) && value !== badgeToEdit?.badgeUrl){
                    lastValidationResult.value = value
                    lastValidationResult.message = 'This badge already exists for this software'
                    return lastValidationResult.message
                  }
                },
                asyncBadgeValidation
              }
            }}
            options={{
              name: 'badgeUrl',
              label: config.badges.badgeUrl.label,
              autofocus: true,
              useNull: true,
              helperTextMessage: errors['badgeUrl']?.message ?? config.badges.badgeUrl.help,
              helperTextCnt: `${badgeUrl?.length ?? 0}/${config.badges.badgeUrl.validation.maxLength.value}`,
              endAdornment: isValidating ? <CircularProgress size={24} /> : undefined
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
              helperTextCnt: `${altText?.length ?? 0}/${config.badges.altText.validation.maxLength.value}`
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
              helperTextCnt: `${badgeLink?.length ?? 0}/${config.badges.badgeLink.validation.maxLength.value}`
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
            disabled={saveDisabled}
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
