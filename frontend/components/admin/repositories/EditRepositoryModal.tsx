// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {useForm} from 'react-hook-form'

import useSmallScreen from '~/config/useSmallScreen'
import ControlledTextField from '~/components/form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledSelect from '~/components/form/ControlledSelect'
import {config} from '~/components/software/edit/repositories/config'
import {EditRepositoryProps} from '~/components/software/edit/repositories/apiRepositories'

type EditSoftwareHeritageModalProps = Readonly<{
  onCancel: () => void,
  onSubmit: (data:EditRepositoryProps) => void,
  item?: EditRepositoryProps
}>

const formId='edit-repository-modal'

export default function EditRepositoryModal({onCancel, onSubmit, item}: EditSoftwareHeritageModalProps) {
  const smallScreen = useSmallScreen()
  const {handleSubmit, watch, formState, control, register} = useForm<EditRepositoryProps>({
    mode: 'onChange',
    defaultValues: item
  })
  // extract form states and possible errors
  const {isValid, isDirty} = formState
  // watch for value changes in the form
  const [url,code_platform,scraping_disabled_reason] = watch(['url','code_platform','scraping_disabled_reason'])

  function handleCancel() {
    // hide
    onCancel()
  }

  return (
    <Dialog
      data-testid="edit-software-repository-modal"
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
        Software repository
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
        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {/* repository url */}
          <ControlledTextField
            control={control}
            options={{
              name: 'url',
              label: config.repository_url.label,
              useNull: true,
              defaultValue: url,
              helperTextMessage: 'The repository url cannot be changed. The repository can only be removed.',
              helperTextCnt: `${url?.length ?? 0}/${config.repository_url.validation.maxLength.value}`,
              disabled: true,
            }}
            rules={config.repository_url.validation}
          />
          {/* code platform */}
          <ControlledSelect
            control={control}
            name='code_platform'
            label={config.repository_platform.label}
            options={config.repository_platform.options}
            disabled={false}
            defaultValue={code_platform}
            helperTextMessage={config.repository_platform.help}
            rules={config.repository_platform.validation}
            sx={{
              width:'9rem'
            }}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'scraping_disabled_reason',
              label: config.repository_disabled_scraping_reason.label,
              useNull: true,
              defaultValue: scraping_disabled_reason,
              helperTextMessage: 'Provide reason to exclude repo from scrapers',
              helperTextCnt: `${scraping_disabled_reason?.length ?? 0}/${config.repository_disabled_scraping_reason.validation.maxLength.value}`
            }}
            rules={config.repository_disabled_scraping_reason.validation}
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
