// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import {useForm} from 'react-hook-form'

import ControlledTextField from '~/components/form/ControlledTextField'
import {useSaveDisabledFormState} from '~/components/form/useSaveDisabledFormState'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {cfg} from './config'
import {NewSoftwareHeritage, SoftwareHeritageItem} from './apiSoftwareHeritage'
import useSmallScreen from '~/config/useSmallScreen'

type EditSoftwareHeritageModalProps = Readonly<{
  onCancel: () => void,
  onSubmit: (data: SoftwareHeritageItem | NewSoftwareHeritage) => void,
  swhid_item?: SoftwareHeritageItem | NewSoftwareHeritage
}>

const formId='edit-software-heritage-modal'

export default function EditSoftwareHeritageModal({onCancel, onSubmit, swhid_item}: EditSoftwareHeritageModalProps) {
  const smallScreen = useSmallScreen()
  const {handleSubmit, watch, formState, control, register} = useForm<SoftwareHeritageItem|NewSoftwareHeritage>({
    mode: 'onChange',
    defaultValues: swhid_item
  })
  // use hook to decide if save buttons should be disabled
  const saveDisabled = useSaveDisabledFormState(formState)
  const {errors} = formState
  // watch for value changes in the form
  const [swhid] = watch(['swhid'])

  // console.group('EditSoftwareHeritageModal')
  // console.log('isValid...', isValid)
  // console.log('isDirty...', isDirty)
  // console.log('swhid...', swhid)
  // console.groupEnd()

  return (
    <Dialog
      data-testid="edit-software-heritage-modal"
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={true}
      onClose={onCancel}
    >
      <DialogTitle>
        Software Heritage ID
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('software')}
        />
        <input type="hidden"
          {...register('position')}
        />
        <DialogContent>
          <ControlledTextField
            control={control}
            options={{
              name: 'swhid',
              label: cfg.modal.swhid.label,
              useNull: true,
              defaultValue: swhid,
              helperTextMessage: errors['swhid']?.message ?? cfg.modal.swhid.help,
              helperTextCnt: `${swhid?.length ?? 0}/${cfg.modal.swhid.validation.maxLength.value}`,
            }}
            rules={cfg.modal.swhid.validation}
          />
        </DialogContent>
        <DialogActions>
          {/*
            Button order in the default styles is reversed  to achieve following goals:
            First button in the tab order is first button at right side
          */}
          <SubmitButtonWithListener
            formId={formId}
            disabled={saveDisabled}
          />
          <Button
            onClick={onCancel}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
