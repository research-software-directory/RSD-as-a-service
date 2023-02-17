// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
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
// import AlertTitle from '@mui/material/AlertTitle'

import {useForm} from 'react-hook-form'

import ControlledTextField from '../form/ControlledTextField'
import {mentionModal as config, mentionType} from './config'
import {MentionItemProps, MentionTypeKeys} from '../../types/Mention'
import ControlledSelect from '~/components/form/ControlledSelect'
import SubmitButtonWithListener from '../form/SubmitButtonWithListener'

export type EditMentionModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: { data: MentionItemProps, pos?: number }) => void,
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

const formId='edit-mention-form'

export default function EditMentionModal({open, onCancel, onSubmit, item, pos, title}: EditMentionModalProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register} = useForm<MentionItemProps>({
    mode: 'onChange',
    defaultValues: {
      ...item
    }
  })
  // extract form states
  const {isValid, isDirty} = formState
  const formData = watch()

  // console.group('EditMentionModal')
  // console.log('isValid...', isValid)
  // console.log('isDirty...', isDirty)
  // console.log('errors...', errors)
  // console.log('formData...', formData)
  // console.groupEnd()

  useEffect(() => {
    if (item) {
      //(re)set form to item values
      reset(item)
    }
  }, [item, reset])

  function handleCancel(reason:any) {
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
      onClose={(e,reason)=>handleCancel(reason)}
      maxWidth="md"
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
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
            padding: '1rem 1.5rem 2.5rem'
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
          <div className="py-2"></div>
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
          <div className="grid grid-cols-[2fr,1fr] gap-4 py-4">
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
          <div className="grid grid-cols-[2fr,1fr] gap-4 py-4">
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
          {formData.mention_type === 'highlight' ?
            <>
              <div className="py-2"></div>
              <ControlledTextField
                control={control}
                options={{
                  name: 'image_url',
                  label: config.image_url.label,
                  useNull: true,
                  defaultValue: formData?.image_url,
                  helperTextMessage: config.image_url.help,
                  helperTextCnt: `${formData?.image_url?.length || 0}/${config.image_url.validation.maxLength.value}`
                }}
                rules={config.image_url.validation}
              />
            </>
            :null
          }
          <div className="py-2"></div>
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
          <Alert severity="warning" sx={{marginTop: '1.5rem'}}>
            {/* <AlertTitle sx={{fontWeight: 500}}>Validate entered information</AlertTitle> */}
            Please double check the data because this entry <strong>cannot be edited after it has been created</strong>.
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
            disabled={isSaveDisabled()}
            formId={formId}
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
