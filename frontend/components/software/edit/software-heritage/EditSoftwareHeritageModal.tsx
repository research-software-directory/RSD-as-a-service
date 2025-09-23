// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'

import {useForm} from 'react-hook-form'

import ControlledTextField from '~/components/form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'

import {cfg} from './config'
import {NewSoftwareHeritage, SoftwareHeritageItem} from './apiSoftwareHeritage'

type EditSoftwareHeritageModalProps = Readonly<{
  onCancel: () => void,
  onSubmit: (data: SoftwareHeritageItem | NewSoftwareHeritage) => void,
  swhid_item?: SoftwareHeritageItem | NewSoftwareHeritage
}>

const formId='edit-software-heritage-modal'

export default function EditSoftwareHeritageModal({onCancel, onSubmit, swhid_item}: EditSoftwareHeritageModalProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, control, register} = useForm<SoftwareHeritageItem|NewSoftwareHeritage>({
    mode: 'onChange',
    defaultValues: swhid_item
  })
  // extract form states and possible errors
  const {isValid, isDirty, errors} = formState
  // watch for value changes in the form
  const [swhid] = watch(['swhid'])

  // console.group('EditSoftwareHeritageModal')
  // console.log('isValid...', isValid)
  // console.log('isDirty...', isDirty)
  // console.log('swhid...', swhid)
  // console.groupEnd()

  function handleCancel() {
    // hide
    onCancel()
  }

  return (
    <Dialog
      data-testid="edit-software-heritage-modal"
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={true}
      onClose={handleCancel}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
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
        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem'
        }}>
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
    if (isValid === false) return true
    if (isDirty === false) return true
    return false
  }
}
