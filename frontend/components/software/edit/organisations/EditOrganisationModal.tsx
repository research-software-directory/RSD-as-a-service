// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import {UseFormSetValue, useForm} from 'react-hook-form'

import {EditOrganisation} from '~/types/Organisation'
import ControlledTextField from '~/components/form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {organisationInformation as config} from '../editSoftwareConfig'
import ControlledImageInput, {FormInputsForImage} from '~/components/form/ControlledImageInput'


type EditOrganisationModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: {data: EditOrganisation, pos?: number}) => void,
  // onDeleteLogo: (logo_id:string) => void,
  organisation?: EditOrganisation,
  // item position in the array
  pos?: number
}

const formId='edit-organisation-modal'

export default function EditOrganisationModal({open, onCancel, onSubmit, organisation, pos}: EditOrganisationModalProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register, setValue, trigger} = useForm<EditOrganisation>({
    mode: 'onChange',
    defaultValues: {
      ...organisation
    }
  })

  // extract
  const {isValid, isDirty, isSubmitSuccessful} = formState
  const formData = watch()

  // console.group('EditOrganisationModal')
  // console.log('formData...', formData)
  // console.log('isValid...', isValid)
  // console.log('errors...', errors)
  // console.log('isSubmitSuccessful...', isSubmitSuccessful)
  // console.groupEnd()

  useEffect(() => {
    setTimeout(() => {
      // validate name on opening of the form
      // we validate organisation name because we take it
      // over from ROR or user input (which might not be valid entry)
      // it needs to be at the end of the cycle, so we need to use setTimeout
      trigger('name')
    }, 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    if (isSubmitSuccessful) {
      // console.group('EditOrganisationModal')
      // console.log('reset form...', isSubmitSuccessful)
      // console.groupEnd()
      reset()
    }
  }, [isSubmitSuccessful,reset])

  function handleCancel() {
    // hide
    onCancel()
  }

  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        {config.modalTitle}
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit((data: EditOrganisation) => onSubmit({data, pos}))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('parent')}
        />
        <input type="hidden"
          {...register('slug')}
        />
        <input type="hidden"
          {...register('position')}
        />
        <input type="hidden"
          {...register('logo_id')}
        />
        <input type="hidden"
          {...register('logo_b64')}
        />
        <input type="hidden"
          {...register('logo_mime_type')}
        />
        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem'
        }}>
          <section className="grid grid-cols-[1fr_3fr] gap-8">
            <ControlledImageInput
              name={formData?.name}
              logo_id={formData?.logo_id}
              logo_b64={formData?.logo_b64}
              setValue={setValue as unknown as UseFormSetValue<FormInputsForImage>}
            />
            <div>
              <ControlledTextField
                control={control}
                options={{
                  name: 'name',
                  label: config.name.label,
                  useNull: true,
                  defaultValue: formData?.name,
                  helperTextMessage: config.name.help,
                  helperTextCnt: `${formData?.name?.length || 0}/${config.name.validation.maxLength.value}`,
                  disabled: organisation?.source==='ROR' ? true : false
                }}
                rules={config.name.validation}
              />
              <div className="py-4"></div>
              <ControlledTextField
                control={control}
                options={{
                  name: 'website',
                  label: config.website.label,
                  useNull: true,
                  defaultValue: formData?.website,
                  helperTextMessage: config.website.help,
                  helperTextCnt: `${formData?.website?.length || 0}/${config.website.validation.maxLength.value}`,
                  disabled: organisation?.source==='ROR' ? true : false
                }}
                rules={config.website.validation}
              />
            </div>
          </section>
          <Alert
            severity="info"
          >
            <AlertTitle>Do you have a logo?</AlertTitle>
            You are the first to reference this organisation and can add a logo now. After clicking on &quot;Save&quot;, logos can only be added by organisation maintainers.
          </Alert>
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            tabIndex={1}
            onClick={handleCancel}
            color="secondary"
            sx={{marginRight:'2rem'}}
          >
            Cancel
          </Button>
          <SubmitButtonWithListener
            formId={formId}
            disabled={isSaveDisabled()}
          />
        </DialogActions>
      </form>
    </Dialog>
  )

  function isSaveDisabled() {
    // if pos is undefined we are creating
    // new entry, but we might already have required
    // information (first name - last name). In this
    // case we only check if form is valid
    if (typeof pos == 'undefined') {
      if (isValid === false) return true
    } else {
      if (isValid === false) return true
      if (isDirty === false) return true
    }
    return false
  }
}
