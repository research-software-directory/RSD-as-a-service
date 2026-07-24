// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {useForm} from 'react-hook-form'

import {NewTestimonial, Testimonial} from '~/types/Testimonial'
import useSmallScreen from '~/config/useSmallScreen'
import ControlledTextField from '~/components/form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {useSaveDisabledFormState} from '~/components/form/useSaveDisabledFormState'

type EditTestimonialModalProps = {
  config: any,
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: {data: Testimonial|NewTestimonial, pos?: number}) => void,
  testimonial?: Testimonial|NewTestimonial,
  // item position in the array
  pos?: number
}

const formId='edit-testimonial-modal'

export default function EditTestimonialModal({config,open,onCancel,onSubmit,testimonial,pos}: EditTestimonialModalProps) {
  const smallScreen = useSmallScreen()
  const {handleSubmit, watch, formState, reset, control, register} = useForm<Testimonial|NewTestimonial>({
    mode: 'onChange',
    defaultValues: {
      ...testimonial
    }
  })
  // use hook to decide if save buttons should be disabled
  const saveDisabled = useSaveDisabledFormState(formState)
  const formData = watch()

  useEffect(() => {
    if (testimonial) {
      reset(testimonial)
    }
  }, [testimonial,reset])

  function handleCancel() {
    // reset form
    reset()
    // hide
    onCancel()
  }

  return (
    <Dialog
      data-testid="edit-testimonial-modal"
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>
        Testimonial
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit((data: Testimonial|NewTestimonial) => onSubmit({data, pos}))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        {/* <input type="hidden"
          {...register('software')}
        /> */}
        <input type="hidden"
          {...register('position')}
        />
        <DialogContent>
          <ControlledTextField
            control={control}
            options={{
              name: 'message',
              multiline: true,
              rows: 4,
              label: config.message.label,
              useNull: true,
              defaultValue: testimonial?.message,
              helperTextMessage: config.message.help,
              helperTextCnt: `${formData?.message?.length || 0}/${config.message.validation.maxLength.value}`,
            }}
            rules={config.message.validation}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'source',
              label: config.source.label,
              useNull: true,
              defaultValue: testimonial?.source,
              helperTextMessage: config.source.help,
              helperTextCnt: `${formData?.source?.length || 0}/${config.source.validation.maxLength.value}`,
            }}
            rules={config.source.validation}
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
