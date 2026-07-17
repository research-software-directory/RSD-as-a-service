// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import {useForm} from 'react-hook-form'

import useSmallScreen from '~/config/useSmallScreen'
import {useDebounce} from '~/utils/useDebounce'
import ControlledTextField from '~/components/form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledSelect from '~/components/form/ControlledSelect'
import AutodetectPlatformInfo from '~/components/software/edit/package-managers/AutodetectPlatformInfo'
import {cfg} from './config'
import {
  CodePlatform, EditRepositoryProps,
  getSoftwareRepositoryByUrl, suggestPlatform
} from './apiRepositories'
import {useSaveDisabledFormState} from '~/components/form/useSaveDisabledFormState'

type EditSoftwareHeritageModalProps = Readonly<{
  onCancel: () => void,
  onSubmit: (data:EditRepositoryProps) => void,
  item?: EditRepositoryProps
}>

const formId='edit-software-repository-modal'

export default function SoftwareRepositoryModal({onCancel, onSubmit, item}: EditSoftwareHeritageModalProps) {
  const smallScreen = useSmallScreen()
  const [suggestedPlatform, setSuggestedPlatform] = useState<{
    key: CodePlatform | null
    lock: boolean
  }>({
    key: null,
    lock: true
  })
  const [loading, setLoading] = useState(false)
  const {handleSubmit, watch, formState, control, register, setValue} = useForm<EditRepositoryProps>({
    mode: 'onChange',
    defaultValues: item
  })
  // use hook to decide if save buttons should be disabled
  const saveDisabled = useSaveDisabledFormState(formState)
  const {errors} = formState
  // watch for value changes in the form
  const [url,code_platform] = watch(['url','code_platform'])
  // take the last slugValue
  const bouncedUrl = useDebounce(url ?? '', 700)
  // show platform help text
  let platformHelpText = cfg.repository_platform.help
  if (code_platform && suggestedPlatform.key && code_platform!==suggestedPlatform.key){
    // in case of difference between suggestion and selection
    platformHelpText='Are you sure?'
  }

  // console.group('SoftwareRepositoryModal')
  // console.log('isValid...', isValid)
  // console.log('isDirty...', isDirty)
  // console.log('loading...', loading)
  // console.log('url...', url)
  // console.log('bouncedUrl...', bouncedUrl)
  // console.log('code_platform...', code_platform)
  // console.log('suggestedPlatform...', suggestedPlatform)
  // console.log('disablePlatformChoice...', disablePlatformChoice)
  // console.groupEnd()

  /**
   * Check if repo already in RSD and obtain advised code_platform.
   */
  useEffect(()=>{
    let abort = false
    if (bouncedUrl && errors?.url===undefined){
      setLoading(true)
      Promise.all([
        getSoftwareRepositoryByUrl(bouncedUrl),
        suggestPlatform(bouncedUrl)
      ]).then(([repo,platform])=>{
        // do nothing on abort
        if (abort) return
        if (repo?.id){
          // we found repo in RSD, save id to use later
          setValue('id',repo.id)
        }
        // platform advice preferred above present value?
        if (platform?.key){
          setValue('code_platform',platform.key,{shouldValidate:true,shouldDirty:true})
        }else if (repo?.code_platform){
          setValue('code_platform',repo?.code_platform,{shouldValidate:true,shouldDirty:true})
        }
        // save suggestion
        setSuggestedPlatform(platform ?? repo?.code_platform)
        // set loading false
        setLoading(false)
      })
    }
    return ()=>{abort=true}
  },[bouncedUrl,errors?.url,setValue])

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
      <DialogTitle>
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
        <input type="hidden"
          {...register('position')}
        />
        <DialogContent>
          {/* repository url */}
          <ControlledTextField
            control={control}
            options={{
              name: 'url',
              label: cfg.repository_url.label,
              useNull: true,
              defaultValue: url,
              helperTextMessage: errors['url']?.message ?? cfg.repository_url.help(url),
              helperTextCnt: `${url?.length ?? 0}/${cfg.repository_url.validation.maxLength.value}`,
              endAdornment: loading ?
                <CircularProgress data-testid="slug-circular-progress" color="primary" size={32} />
                : undefined
            }}
            rules={cfg.repository_url.validation}
          />
          {/* code platform */}
          <ControlledSelect
            control={control}
            name='code_platform'
            label={cfg.repository_platform.label}
            options={cfg.repository_platform.options}
            disabled={suggestedPlatform.lock}
            defaultValue={code_platform ?? suggestedPlatform}
            helperTextMessage={platformHelpText}
            rules={cfg.repository_platform.validation}
            sx={{
              width:'9rem'
            }}
          />
          {/* info about code platform */}
          <AutodetectPlatformInfo />
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
