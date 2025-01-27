// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useRef, useState} from 'react'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote'

import {useForm} from 'react-hook-form'

import {useDebounce} from '~/utils/useDebounce'
import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import ControlledTextField from '~/components/form/ControlledTextField'
import config from './config'
import {EditRemoteRsd, getRemoteName, isValidRemoteRsdUrl} from './apiRemoteRsd'

type RemoteRsdModalProps = Readonly<{
  remoteRsd?: EditRemoteRsd
  onCancel: () => void,
  onSubmit: (item: EditRemoteRsd) => void
}>

const formId='add-remote-rsd-form'

export default function RemoteRsdModal({remoteRsd,onCancel,onSubmit}:RemoteRsdModalProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const [validating, setValidating]=useState(false)
  const [remoteName, setRemoteName]=useState<string>()
  const {register, handleSubmit, watch, formState, control, setError, setValue} = useForm<EditRemoteRsd>({
    mode: 'onChange',
    defaultValues: remoteRsd
  })
  const {errors, isValid, isDirty} = formState
  // watch for data change in the form
  const [label,domain] = watch(['label','domain'])
  // bounce domain value for async validation
  const bouncedDomain = useDebounce(domain,700)
  // keep validatedDomain as reference through renders
  const validatedDomain = useRef('')

  // console.group('RemoteRsdModal')
  // console.log('isValid...', isValid)
  // console.log('isDirty...', isDirty)
  // console.log('errors...', errors)
  // console.log('domain...', domain)
  // console.log('bouncedDomain...', bouncedDomain)
  // console.groupEnd()

  /**
   * When bouncedDomain value is changed by debounce we check if domain is valid remote RSD
   */
  useEffect(() => {
    let abort = false
    async function validateRsd() {
      const [isValid, remote] = await Promise.all([
        isValidRemoteRsdUrl(bouncedDomain),
        getRemoteName(bouncedDomain)
      ])

      if (abort) return
      if (isValid === false) {
        const message = `Failed to connect to ${bouncedDomain} remote endpoint`
        setError('domain',{type:'validate',message})
      }
      if (remote){
        // advised remote name
        setRemoteName(remote)
        // set label name if not present
        if (!label) setValue('label',remote,{shouldDirty:true,shouldValidate:true})
      }else if (isValid){
        const hostname = `@${new URL(bouncedDomain).hostname}`
        if (!label) setValue('label',hostname,{shouldDirty:true,shouldValidate:true})
      }
      setValidating(false)
      // save to validatedDomain
      validatedDomain.current = bouncedDomain
    }
    if (bouncedDomain &&
      bouncedDomain === domain &&
      validatedDomain.current !== bouncedDomain &&
      !errors?.domain) {
      validateRsd()
    }else if (!domain){
      // fix: remove validating/spinner when no slug
      setValidating(false)
    }
    return ()=>{abort=true}
  },[bouncedDomain,domain,errors?.domain,label,setError,setValue])

  useEffect(()=>{
    // As soon as the domain value start changing we signal to user that we need to validate new domain.
    // New domain is "debounced" into variable bouncedDomain after the user stops typing.
    // Another useEffect monitors bouncedDomain value and performs the validation.
    // Validating flag disables Save button from the moment the slug value is changed until the validation is completed.
    if (domain && !errors?.domain){
      // debugger
      setValidating(true)
    }
  },[domain,errors?.domain])

  function handleCancel(e:any,reason: 'backdropClick' | 'escapeKeyDown') {
    // close only on escape, not if user clicks outside of the modal
    if (reason==='escapeKeyDown') onCancel()
  }

  return (
    <Dialog
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
        {config.modalTitle}
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full">

        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />

        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem'
        }}>
          <TextFieldWithCounter
            options={{
              autofocus:true,
              error: errors.domain?.message !== undefined,
              label: config.domain.label,
              helperTextMessage: errors?.domain?.message ?? config.domain.help,
              helperTextCnt: `${domain?.length || 0}/${config.domain.validation.maxLength.value}`,
              variant:'outlined',
              endAdornment: validating ? <CircularProgress /> : undefined
            }}
            register={register('domain', {
              ...config.domain.validation
            })}
          />

          <div className="py-4" />

          <ControlledTextField
            control={control}
            options={{
              name: 'label',
              label: config.label.label,
              helperTextMessage: errors?.label?.message ?? config.label.help,
              helperTextCnt: `${label?.length || 0}/${config.label.validation.maxLength.value}`,
              variant:'outlined',
              endAdornment: remoteName && remoteName !== label ?
                <IconButton
                  title={`Use suggested remote name: ${remoteName}`}
                  onClick={()=>setValue('label',remoteName,{shouldValidate:true,shouldDirty:true})}>
                  <SettingsRemoteIcon/>
                </IconButton>
                : undefined
            }}
          />

          <div className="grid grid-cols-2 gap-20 items-start pt-8">
            <ControlledSwitch
              label="Active"
              name="active"
              control={control}
              defaultValue={true}
            />

            <TextFieldWithCounter
              options={{
                type: 'number',
                error: errors.scrape_interval_minutes?.message !== undefined,
                label: config.scrape_interval_minutes.label,
                helperTextMessage: errors?.scrape_interval_minutes?.message ?? config.scrape_interval_minutes.help,
                variant:'outlined',
                defaultValue: remoteRsd?.scrape_interval_minutes.toString() ?? '60',
                endAdornment: 'min.'
              }}
              register={register('scrape_interval_minutes', {
                ...config.scrape_interval_minutes.validation
              })}
            />
          </div>

        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            onClick={onCancel}
            color="secondary"
            sx={{marginRight:'2rem'}}
          >
            Cancel
          </Button>
          <SubmitButtonWithListener
            formId={formId}
            disabled={isSubmitDisabled()}
          />
        </DialogActions>
      </form>
    </Dialog>
  )

  function isSubmitDisabled(){
    if (isValid===false) return true
    // we need additional check on errors object
    // due to custom validation of domain
    if (Object.keys(errors).length > 0) return true
    if (isDirty===false) return true
    if (validating) return true
    return false
  }
}
