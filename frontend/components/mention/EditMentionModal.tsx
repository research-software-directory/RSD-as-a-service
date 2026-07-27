// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Alert from '@mui/material/Alert'

import {useForm} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import useSmallScreen from '~/config/useSmallScreen'
import ControlledTextField from '~/components/form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledSelect from '~/components/form/ControlledSelect'
import {useSaveDisabledFormState} from '~/components/form/useSaveDisabledFormState'
import {mentionModal as config, mentionType} from './config'

export type EditMentionModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: {data: MentionItemProps, pos?: number}) => void,
  item?: MentionItemProps,
  // item position in the array
  pos?: number
  title?: string
}

// manual/editable mention type options
const manualOptions = Object.keys(mentionType).filter(key => {
  return mentionType[key as MentionTypeKeys]?.manual
})
const mentionTypeOptions = manualOptions.map(key => {
  const type = mentionType[key as MentionTypeKeys].singular
  return {
    value: key,
    label: type
  }
})

const formId = 'edit-mention-form'

export default function EditMentionModal({open, onCancel, onSubmit, item, pos, title}: EditMentionModalProps) {
  const {user} = useSession()
  const isAdmin = user?.role === 'rsd_admin'
  const smallScreen = useSmallScreen()
  const {handleSubmit, watch, formState, reset, control, register, clearErrors} = useForm<MentionItemProps>({
    mode: 'onChange',
    defaultValues: {
      ...item
    }
  })
  // use hook to decide if save buttons should be disabled
  const saveDisabled = useSaveDisabledFormState(formState)
  const {errors} = formState
  const formData = watch()
  // need to clear image_url error manually after the type change
  // and dynamic rules change from required to not required
  if (formData.mention_type !== 'highlight' && errors?.hasOwnProperty('image_url')) {
    clearErrors('image_url')
  }

  // console.group('EditMentionModal')
  // console.log('isValid...', isValid)
  // console.log('isDirty...', isDirty)
  // console.log('errors...', errors)
  // console.log('formData...', formData)
  // console.groupEnd()

  function handleCancel(reason: any) {
    if (reason === 'backdropClick') {
      // we do not cancel on backdrop click
      // only on escape or using cancel button
      return false
    }
    // reset form to empty
    reset()
    // hide
    onCancel()
  }

  function onSubmitForm(data: MentionItemProps) {
    // we need to clean image_url data
    if (data.mention_type !== 'highlight') {
      data.image_url = null
    }
    onSubmit({data, pos})
  }

  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={(e, reason) => handleCancel(reason)}
      maxWidth="md"
    >
      <DialogTitle>
        {title ? title : 'Mention'}
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmitForm)}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('source')}
        />
        <DialogContent
          sx={{
            width: ['100%'],
            padding: '1rem 1.5rem'
          }}>
          <ControlledTextField
            control={control}
            options={{
              name: 'title',
              label: config.title.label,
              autofocus: true,
              useNull: true,
              defaultValue: formData?.title,
              helperTextMessage: config.title.help,
              helperTextCnt: `${formData?.title?.length || 0}/${config.title.validation.maxLength.value}`,
            }}
            rules={config.title.validation}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'authors',
              label: config.authors.label,
              useNull: true,
              defaultValue: formData?.authors,
              helperTextMessage: config.authors.help,
              helperTextCnt: `${formData?.authors?.length || 0}/${config.authors.validation.maxLength.value}`,
            }}
            rules={config.authors.validation}
          />
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <ControlledTextField
              control={control}
              options={{
                name: 'publisher',
                label: config.publisher.label,
                useNull: true,
                defaultValue: formData?.publisher,
                helperTextMessage: config.publisher.help,
                // helperTextCnt: `${formData?.message?.length || 0}/${config.message.validation.maxLength.value}`,
              }}
              rules={config.publication_year.validation}
            />
            <ControlledTextField
              control={control}
              options={{
                name: 'page',
                label: config.page.label,
                useNull: true,
                defaultValue: formData?.page ?? null,
                helperTextMessage: config.page.help,
                // helperTextCnt: `${formData?.message?.length || 0}/${config.message.validation.maxLength.value}`,
              }}
              rules={config.publication_year.validation}
            />
          </div>
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <ControlledSelect
              name="mention_type"
              label={config.mentionType.label}
              control={control}
              options={mentionTypeOptions}
              rules={config.mentionType.validation}
              defaultValue={formData?.mention_type ?? null}
              disabled={false}
              helperTextMessage={config.mentionType.help}
            />
            <ControlledTextField
              control={control}
              options={{
                name: 'publication_year',
                type: 'number',
                label: config.publication_year.label,
                useNull: true,
                defaultValue: formData?.publication_year ?? null,
                helperTextMessage: config.publication_year.help
              }}
              rules={config.publication_year.validation}
            />
          </div>
          <ControlledTextField
            control={control}
            options={{
              name: 'journal',
              label: config.journal.label,
              useNull: true,
              defaultValue: formData?.journal,
              helperTextMessage: config.journal.help,
              helperTextCnt: `${formData?.journal?.length || 0}/${config.journal.validation.maxLength.value}`,
            }}
            rules={config.journal.validation}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'url',
              label: config.url.label,
              useNull: true,
              defaultValue: formData?.url,
              helperTextMessage: config.url.help,
              helperTextCnt: `${formData?.url?.length || 0}/${config.url.validation.maxLength.value}`,
            }}
            rules={config.url.validation}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'image_url',
              label: config.image_url.label,
              useNull: true,
              defaultValue: formData?.image_url,
              helperTextMessage: config.image_url.help,
              helperTextCnt: `${formData?.image_url?.length || 0}/${config.image_url.validation.maxLength.value}`,
              // if type not highlight we remove required flag and disable input
              disabled: formData?.mention_type !== 'highlight'
            }}
            rules={formData?.mention_type === 'highlight' ?
              config.image_url.validation :
              {
                // if type not highlight we remove required flag and disable input
                required: false
              }
            }
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'note',
              label: config.note.label,
              useNull: true,
              defaultValue: formData?.note,
              helperTextMessage: config.note.help,
              helperTextCnt: `${formData?.note?.length || 0}/${config.note.validation.maxLength.value}`,
            }}
            rules={config.note.validation}
          />
          {isAdmin &&
            <>
              <ControlledTextField
                control={control}
                options={{
                  name: 'doi',
                  label: config.doi.label,
                  useNull: true,
                  defaultValue: formData?.doi,
                  helperTextMessage: config.doi.help,
                  helperTextCnt: `${formData?.doi?.length || 0}/${config.doi.validation.maxLength.value}`,
                }}
                rules={config.doi.validation}
              />
              <ControlledTextField
                control={control}
                options={{
                  name: 'openalex_id',
                  label: config.openalex_id.label,
                  useNull: true,
                  defaultValue: formData?.openalex_id,
                  helperTextMessage: config.openalex_id.help,
                }}
                rules={config.openalex_id.validation}
              />
            </>
          }
          {!isAdmin &&
            <Alert severity="warning">
              The information can not be edited after creation.
            </Alert>}
        </DialogContent>
        <DialogActions>
          {/*
            Button order in the default styles is reversed  to achieve following goals:
            First button in the tab order is first button at right side
          */}
          <SubmitButtonWithListener
            disabled={saveDisabled}
            formId={formId}
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
