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

import {useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import {UseFormSetValue, useForm} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {useDebounce} from '~/utils/useDebounce'
import {getSlugFromString} from '~/utils/getSlugFromString'
import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import SlugTextField from '~/components/form/SlugTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledImageInput, {FormInputsForImage} from '~/components/form/ControlledImageInput'
import config from './config'
import {Community, validCommunitySlug} from './apiCommunities'

type AddCommunityModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: (item:EditCommunityProps) => Promise<void>
}

export type EditCommunityProps = Community & {
  logo_b64?: string | null
  logo_mime_type?: string | null
}

let lastValidatedSlug = ''
const formId='add-community-form'

export default function AddPageModal({open,onCancel,onSubmit}:AddCommunityModalProps) {
  const {token} = useSession()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const [baseUrl, setBaseUrl] = useState('')
  const [slugValue, setSlugValue] = useState('')
  const [validating, setValidating]=useState(false)
  const {register, handleSubmit, watch, formState, setError, setValue} = useForm<EditCommunityProps>({
    mode: 'onChange',
    defaultValues: {
      slug:'',
      name: '',
      short_description: null,
      description: null,
      primary_maintainer: null,
      logo_id: null,
      logo_b64: null,
      logo_mime_type: null
    }
  })
  const {errors, isValid} = formState
  // watch for data change in the form
  const [slug,name,short_description,logo_id,logo_b64] = watch(['slug','name','short_description','logo_id','logo_b64'])
  // construct slug from title
  const bouncedSlug = useDebounce(slugValue,700)

  useEffect(() => {
    if (typeof location != 'undefined') {
      setBaseUrl(`${location.origin}/${config.rsdRootPath}/`)
    }
  }, [])

  /**
   * Convert name value into slugValue.
   * The name is then debounced and produces bouncedSlug
   * We use bouncedSlug value later on to perform call to api
   */
  useEffect(() => {
    const softwareSlug = getSlugFromString(name)
    setSlugValue(softwareSlug)
  }, [name])
  /**
   * When bouncedSlug value is changed,
   * we need to update slug value (value in the input) shown to user.
   * This change occurs when brand_name value is changed
   */
  useEffect(() => {
    setValue('slug', bouncedSlug, {
      shouldValidate: true
    })
  }, [bouncedSlug, setValue])

  useEffect(() => {
    let abort = false
    async function validateSlug() {
      setValidating(true)
      const isUsed = await validCommunitySlug({slug,token})
      if (abort) return
      if (isUsed === true) {
        const message = `${slug} is already taken. Use letters, numbers and dash "-" to modify slug value.`
        setError('slug', {
          type: 'validate',
          message
        })
      }
      lastValidatedSlug = slug
      // we need to wait some time
      setValidating(false)
    }
    if (slug !== lastValidatedSlug) {
      // debugger
      validateSlug()
    }
    return ()=>{abort=true}
  },[slug,token,setError])

  function isSaveDisabled() {
    // during async validation we disable button
    if (validating === true) return true
    // if isValid is not true
    return isValid===false
  }

  function handleCancel(e:any,reason: 'backdropClick' | 'escapeKeyDown') {
    // close only on escape, not if user clicks outside of the modal
    if (reason==='escapeKeyDown') onCancel()
  }

  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
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
          {...register('logo_id')}
        />
        <input type="hidden"
          {...register('logo_b64')}
        />
        <input type="hidden"
          {...register('logo_mime_type')}
        />

        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem'
        }}>
          <TextFieldWithCounter
            options={{
              autofocus:true,
              error: errors.name?.message !== undefined,
              label: config.name.label,
              helperTextMessage: errors?.name?.message ?? config.name.help,
              helperTextCnt: `${name?.length || 0}/${config.name.validation.maxLength.value}`,
              variant:'outlined'
            }}
            register={register('name', {
              ...config.name.validation
            })}
          />
          <section className="py-8 flex gap-8">
            <ControlledImageInput
              name={name}
              logo_id={logo_id}
              logo_b64={logo_b64}
              setValue={setValue as unknown as UseFormSetValue<FormInputsForImage>}
            />
            <TextFieldWithCounter
              options={{
                multiline: true,
                rows: 4,
                error: errors.short_description?.message !== undefined,
                label: config.short_description.label,
                helperTextMessage: errors?.short_description?.message ?? config.short_description.help,
                helperTextCnt: `${short_description?.length || 0}/${config.short_description.validation.maxLength.value}`,
                variant:'outlined'
              }}
              register={register('short_description', {
                ...config.short_description.validation
              })}
            />
          </section>

          <SlugTextField
            baseUrl={baseUrl}
            loading={validating}
            options={{
              label:config.slug.label,
              error: errors.slug?.message !== undefined,
              helperText: errors?.slug?.message ?? config.slug.help
            }}
            register={register('slug',config.slug.validation)}
          />

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
            disabled={isSaveDisabled()}
          />
        </DialogActions>
      </form>
    </Dialog>
  )
}
