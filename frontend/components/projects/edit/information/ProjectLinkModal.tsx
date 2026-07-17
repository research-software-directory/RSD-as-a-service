// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'

import {useForm} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {ProjectLink} from '~/types/Project'
import {addProjectLink, updateProjectLink} from '~/components/projects/edit/apiEditProject'
import ControlledTextField from '~/components/form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {useSaveDisabledFormState} from '~/components/form/useSaveDisabledFormState'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {projectInformation as config} from './config'

export type ProjectProjectLinkModalProps = {
  pos?: number
  open: boolean,
  url_for_project: ProjectLink | undefined,
  onCancel: () => void,
  onSubmit: ({data, pos}: {data: ProjectLink, pos?: number}) => void,
}

const formId='edit-link-modal'

export default function ProjectLinkModal({open, url_for_project, onCancel, onSubmit, pos}: ProjectProjectLinkModalProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {formState, reset, control, register, getValues} = useForm<ProjectLink>({
    mode: 'onChange',
    defaultValues: {
      ...url_for_project
    }
  })
  // use hook to decide if save buttons should be disabled
  const saveDisabled = useSaveDisabledFormState(formState)
  const {errors} = formState

  // console.group(`ProjectLinkModal...${pos}`)
  // console.log('errors...', errors)
  // console.log('formData...', formData)
  // console.log('url_for_project...', url_for_project)
  // console.groupEnd()

  useEffect(() => {
    reset(url_for_project)
  },[url_for_project,reset])

  function handleCancel() {
    // reset form
    reset()
    // hide
    onCancel()
  }

  async function saveLink() {
    const {id, project, title, url, position} = getValues()
    const link = {
      id,
      project,
      title,
      url,
      position
    }
    let resp
    if (link.id) {
      // update link
      resp = await updateProjectLink({
        link,
        token
      })
      if (resp.status === 200) {
        onSubmit({data:link,pos})
      } else {
        showErrorMessage(`Failed to update link. ${resp.message}`)
      }
    } else {
      // create link
      resp = await addProjectLink({
        link,
        token
      })
      if (resp.status == 201) {
        // we get id back
        link.id = resp.message
        // pass for local update
        onSubmit({data:link})
      } else {
        showErrorMessage(`Failed to update link. ${resp.message}`)
      }
    }
  }

  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>
        Project link
      </DialogTitle>
      <form
        id={formId}
        onSubmit={(e) => {
          // prevent default submit
          e.preventDefault()
          // call save link fn
          saveLink()
        }}
        autoComplete="off"
      >
        <input type="hidden"
          {...register('id', {
            required: false
          })}
        />
        <input type="hidden"
          {...register('project', {
            required: true
          })}
        />
        <DialogContent>
          <ControlledTextField
            control={control}
            rules={config.url_for_project.title.validation}
            options={{
              name: 'title',
              label: config.url_for_project.title.placeholder,
              defaultValue: url_for_project?.title ?? '',
              muiProps:{
                autoFocus: true,
                autoComplete: 'off',
                // placeholder: config.url_for_project.title.placeholder,
                variant: 'standard',
                sx: {
                  width: '100%',
                },
                helperText: errors?.title ? errors?.title?.message : config.url_for_project.title.label,
                error: errors?.title ? true : false
              }
            }}
          />
          <ControlledTextField
            control={control}
            rules={config.url_for_project.url.validation}
            options={{
              name: 'url',
              label: 'Url',
              defaultValue: url_for_project?.url ?? '',
              muiProps: {
                autoComplete: 'off',
                // placeholder: config.url_for_project.url.placeholder,
                variant: 'standard',
                sx: {
                  width: '100%',
                },
                helperText: errors?.url ? errors?.url?.message : config.url_for_project.url.label,
                error: errors?.url ? true : false
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          {/*
            Button order in the default styles is reversed  to achieve following goal:
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
