// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'

import {useForm} from 'react-hook-form'

import {LicenseForSoftware} from '~/types/SoftwareTypes'
import ControlledTextField from '~/components/form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import {config} from './config'
import {useSaveDisabledFormState} from '~/components/form/useSaveDisabledFormState'

export type EditLicenseModal = {
  open: boolean,
  onCancel: () => void,
  onSubmit: (data: LicenseForSoftware) => void,
  data?: LicenseForSoftware
}

const formId='edit-testimonial-modal'

export default function EditLicenseModal({open, onCancel, onSubmit, data}: EditLicenseModal) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register} = useForm<LicenseForSoftware>({
    mode: 'onChange',
    defaultValues: {
      ...data
    }
  })
  // use hook to decide if save buttons should be disabled
  const saveDisabled = useSaveDisabledFormState(formState)
  const {errors} = formState
  const formData = watch()

  // console.group('EditLicenseModal')
  // console.log('isValid...', isValid)
  // console.log('errors...', errors)
  // console.groupEnd()

  function handleCancel() {
    // reset form
    reset()
    // hide
    onCancel()
  }

  return (
    <Dialog
      data-testid="edit-license-modal"
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>
        {config.licenses.modal.title}
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('software')}
        />
        <input type="hidden"
          {...register('license')}
        />
        <DialogContent>
          <ControlledSwitch
            control={control}
            name='open_source'
            label={config.licenses.modal.open_source.label}
            defaultValue={data?.open_source}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'license',
              label: config.licenses.modal.license.label,
              useNull: true,
              defaultValue: data?.license,
              helperTextMessage: errors['license']?.message ?? config.licenses.modal.license.help,
              helperTextCnt: `${formData?.name?.length || 0}/${config.licenses.modal.license.validation.maxLength.value}`,
            }}
            rules={config.licenses.modal.license.validation}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'name',
              label: config.licenses.modal.name.label,
              useNull: true,
              defaultValue: data?.name,
              helperTextMessage: errors['name']?.message ?? config.licenses.modal.name.help,
              helperTextCnt: `${formData?.name?.length || 0}/${config.licenses.modal.name.validation.maxLength.value}`,
            }}
            rules={config.licenses.modal.name.validation}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'reference',
              label: config.licenses.modal.reference.label,
              useNull: true,
              defaultValue: data?.reference,
              helperTextMessage: errors['reference']?.message ?? config.licenses.modal.reference.help,
              helperTextCnt: `${formData?.reference?.length || 0}/${config.licenses.modal.reference.validation.maxLength.value}`,
            }}
            rules={config.licenses.modal.reference.validation}
          />
        </DialogContent>
        <DialogActions>
          <SubmitButtonWithListener
            formId={formId}
            disabled={saveDisabled}
          />
          <Button
            onClick={handleCancel}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
