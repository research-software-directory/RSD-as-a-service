// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
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
import {useSaveDisabledFormState} from '~/components/form/useSaveDisabledFormState'
import {cfg} from '~/components/software/edit/repositories/config'
import {RepositoryUrl} from '~/components/software/edit/repositories/apiRepositories'

type EditSoftwareHeritageModalProps = Readonly<{
  onCancel: () => void,
  onSubmit: ({id,data}:{id:string,data:Partial<RepositoryUrl>}) => void,
  item?: RepositoryUrl
}>

const formId='edit-repository-modal'

export default function EditRepositoryModal({onCancel, onSubmit, item}: EditSoftwareHeritageModalProps) {
  const smallScreen = useSmallScreen()
  const {handleSubmit, watch, formState, control, register} = useForm<RepositoryUrl>({
    mode: 'onChange',
    defaultValues: item
  })
  // use hook to decide if save buttons should be disabled
  const saveDisabled = useSaveDisabledFormState(formState)
  // extract form states and possible errors
  // const {isValid, isDirty} = formState
  // watch for value changes in the form
  const [
    url,code_platform,
    scraping_disabled_reason,
    basic_data_last_error,
    languages_last_error,
    commit_history_last_error,
    contributor_count_last_error
  ] = watch([
    'url','code_platform','scraping_disabled_reason',
    'basic_data_last_error','languages_last_error',
    'commit_history_last_error','contributor_count_last_error'
  ])

  function handleCancel() {
    // hide
    onCancel()
  }

  function prepareData(data:RepositoryUrl){
    const patchData:Partial<RepositoryUrl> = {
      code_platform: data.code_platform,
      scraping_disabled_reason: data.scraping_disabled_reason,
      basic_data_last_error: data.basic_data_last_error,
      languages_last_error: data.languages_last_error,
      commit_history_last_error: data.commit_history_last_error,
      contributor_count_last_error: data.contributor_count_last_error
    }
    onSubmit({id:data.id as string, data:patchData})
  }

  return (
    <Dialog
      data-testid="edit-software-repository-modal"
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={true}
      onClose={handleCancel}
    >
      <DialogTitle>
        Software repository
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit(prepareData)}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <DialogContent>
          {/* repository url */}
          <div className="flex gap-4">
            <ControlledTextField
              control={control}
              options={{
                name: 'url',
                label: cfg.repository_url.label,
                useNull: true,
                defaultValue: url,
                helperTextMessage: 'The repository url cannot be changed. The repository can only be removed.',
                helperTextCnt: `${url?.length ?? 0}/${cfg.repository_url.validation.maxLength.value}`,
                disabled: true,
              }}
              rules={cfg.repository_url.validation}
            />
            {/* code platform */}
            <ControlledSelect
              control={control}
              name='code_platform'
              label={cfg.repository_platform.label}
              options={cfg.repository_platform.options}
              disabled={false}
              defaultValue={code_platform}
              helperTextMessage={cfg.repository_platform.help}
              rules={cfg.repository_platform.validation}
              sx={{
                width:'10rem'
              }}
            />
          </div>
          <ControlledTextField
            control={control}
            options={{
              name: 'scraping_disabled_reason',
              label: cfg.repository_disabled_scraping_reason.label,
              useNull: true,
              defaultValue: scraping_disabled_reason,
              helperTextMessage: 'Provide reason to exclude repo from scrapers',
              helperTextCnt: `${scraping_disabled_reason?.length ?? 0}/${cfg.repository_disabled_scraping_reason.validation.maxLength.value}`
            }}
            rules={cfg.repository_disabled_scraping_reason.validation}
          />
          {/* <div className='bg-error text-error-content p-1 rounded-xs'></div> */}
          <ControlledTextField
            control={control}
            options={{
              name: 'basic_data_last_error',
              label: cfg.basic_data_last_error.label,
              useNull: true,
              defaultValue: basic_data_last_error,
              helperTextMessage: cfg.basic_data_last_error.help,
              helperTextCnt: `${basic_data_last_error?.length ?? 0}/${cfg.basic_data_last_error.validation.maxLength.value}`
            }}
            rules={cfg.basic_data_last_error.validation}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'languages_last_error',
              label: cfg.languages_last_error.label,
              useNull: true,
              defaultValue: languages_last_error,
              helperTextMessage: cfg.languages_last_error.help,
              helperTextCnt: `${languages_last_error?.length ?? 0}/${cfg.languages_last_error.validation.maxLength.value}`
            }}
            rules={cfg.languages_last_error.validation}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'commit_history_last_error',
              label: cfg.commit_history_last_error.label,
              useNull: true,
              defaultValue: commit_history_last_error,
              helperTextMessage: cfg.commit_history_last_error.help,
              helperTextCnt: `${commit_history_last_error?.length ?? 0}/${cfg.commit_history_last_error.validation.maxLength.value}`
            }}
            rules={cfg.commit_history_last_error.validation}
          />
          <ControlledTextField
            control={control}
            options={{
              name: 'contributor_count_last_error',
              label: cfg.contributor_count_last_error.label,
              useNull: true,
              defaultValue: contributor_count_last_error,
              helperTextMessage: cfg.contributor_count_last_error.help,
              helperTextCnt: `${contributor_count_last_error?.length ?? 0}/${cfg.contributor_count_last_error.validation.maxLength.value}`
            }}
            rules={cfg.contributor_count_last_error.validation}
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
