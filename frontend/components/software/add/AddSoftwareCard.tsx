// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

import {useForm} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {NewSoftwareItem} from '~/types/SoftwareTypes'
import {useDebounce} from '~/utils/useDebounce'
import {getSlugFromString} from '~/utils/getSlugFromString'
import {addSoftware,validSoftwareItem} from '~/components/software/edit/apiEditSoftware'
import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import SlugTextField from '~/components/form/SlugTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {addConfig as config} from './addConfig'

const initialState = {
  loading: false,
  error:''
}

type AddSoftwareForm = {
  slug: string,
  brand_name: string,
  short_statement: string|null,
}

// let lastValidatedSlug = ''
const formId = 'add-software-form'

export default function AddSoftwareCard() {
  const {token} = useSession()
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')
  const [validating, setValidating]=useState(false)
  const [state, setState] = useState(initialState)
  const {register, handleSubmit, watch, formState, setValue,setError} = useForm<AddSoftwareForm>({
    mode: 'onChange'
  })
  const {errors, isValid} = formState
  // watch for data change in the form
  const [slug,brand_name,short_statement] = watch(['slug', 'brand_name', 'short_statement'])
  // take the last slugValue
  const bouncedSlug = useDebounce(slug, 700)

  // console.group('AddSoftwareCard')
  // console.log('slug...', slug)
  // console.log('lastValidatedSlug...', lastValidatedSlug)
  // console.log('bouncedSlug...', bouncedSlug)
  // console.log('errors...', errors)
  // console.log('isValid...', isValid)
  // console.log('validating...', validating)
  // console.groupEnd()

  useEffect(() => {
    if (typeof location != 'undefined') {
      setBaseUrl(`${location.origin}/software/`)
    }
  }, [])

  /**
   * Convert brand_name value into slugValue.
   * The slugValue is then debounced and produces bouncedSlug
   * We use bouncedSlug value later on to perform call to api
   */
  useEffect(() => {
    // construct slug from title
    if (brand_name) {
      const slugValue = getSlugFromString(brand_name)
      // update slugValue
      setValue('slug',slugValue,{shouldValidate:true,shouldDirty:true})
    }
  }, [brand_name, setValue])

  useEffect(() => {
    let abort = false
    /**
     * When bouncedSlug value is changed we perform slug validation.
     * In addition to "basic" react-hook-form validations we check here if the slug is already
     * used by existing software entries. I moved this validation here because react-hook-form
     * async validate function calls api 2 times.
     */
    async function validateSlug() {
      // check if slug is already taken
      const isUsed = await validSoftwareItem(bouncedSlug, token)
      if (abort) return
      if (isUsed === true) {
        // construct error message
        const message = `${bouncedSlug} is already taken. Use letters, numbers and dash "-" to modify slug value.`
        setError('slug',{type:'custom-slug-validation',message})
      }
      setValidating(false)
    }
    // debugger
    if (bouncedSlug && token && bouncedSlug === slug) {
      validateSlug()
    } else if (!slug){
      // fix: remove validating/spinner when no slug
      setValidating(false)
    }
    return ()=>{abort=true}
  },[bouncedSlug,slug,token,setError])

  useEffect(()=>{
    // As soon as the slug value start changing we signal to user that we need to validate new slug.
    // New slug value is "debounced" into variable bouncedSlug after the user stops typing.
    // Another useEffect monitors bouncedSlug value and performs the validation.
    // Validating flag disables Save button from the moment the slug value is changed until the validation is completed.
    if (slug && !errors?.brand_name && !errors?.slug){
      // debugger
      setValidating(true)
    }
  },[slug,errors?.brand_name,errors?.slug])

  function handleCancel() {
    // on cancel we send user back to previous page
    router.back()
  }

  function onSubmit(data: AddSoftwareForm) {
    // set flags
    if (token && data.slug && data.brand_name) {
      setState({
        loading: true,
        error:''
      })
      // unsure null value used when empty string
      if (data.short_statement==='') data.short_statement=null
      // create data object
      const software:NewSoftwareItem = {
        brand_name: data.brand_name,
        slug: data.slug,
        short_statement: data.short_statement,
        is_published: false,
        description: null,
        description_type: 'markdown',
        description_url: null,
        get_started_url: null,
        concept_doi: null,
        image_id: null
      }
      // add software to database
      addSoftware({
        software,
        token
      }).then(resp => {
        if (resp.status === 201) {
          // redirect to edit page
          // and remove software/add route from the history
          router.replace(`/software/${software.slug}/edit`)
        } else {
          // show error
          setState({
            ...state,
            loading: false,
            error: `Failed to add software. Error: ${resp.message}`
          })
        }
      })
    } else {
      setState({
        loading: false,
        error:'Missing required information'
      })
    }
  }

  function renderDialogText() {
    // show error message
    if (state.error) {
      return (
        <Alert severity="error">
          {state.error}
        </Alert>
      )
    }
    // show loading circle
    if (state.loading) {
      return (
        <CircularProgress size="1.5rem" />
      )
    }
    // show default info
    return config.addInfo
  }

  function isSaveDisabled() {
    // during saving we disable button
    if (state.loading === true) return true
    // during async validation we disable button
    if (validating === true) return true
    // check for errors
    if (Object.keys(errors).length > 0) return true
    // if isValid is not true
    return isValid===false
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full md:w-[42rem] mx-auto">
      <section className="min-h-[6rem]">
        <h1 className="text-primary text-2xl mb-4">{config.title}</h1>
        {renderDialogText()}
      </section>
      <section className="py-8">
        <TextFieldWithCounter
          options={{
            autofocus:true,
            error: errors.brand_name?.message !== undefined,
            label: config.brand_name.label,
            helperTextMessage: errors?.brand_name?.message ?? config.brand_name.help,
            helperTextCnt: `${brand_name?.length || 0}/${config.brand_name.validation.maxLength.value}`,
            variant:'outlined'
          }}
          register={register('brand_name', {
            ...config.brand_name.validation
          })}
        />
        <div className="py-4"></div>
        <TextFieldWithCounter
          options={{
            multiline: true,
            rows:5,
            error: errors?.short_statement?.message !== undefined,
            label: config.short_statement.label,
            helperTextMessage: errors?.short_statement?.message ?? config.short_statement.help,
            helperTextCnt: `${short_statement?.length || 0}/${config.short_statement.validation.maxLength.value}`,
            variant:'outlined'
          }}
          register={register('short_statement', config.short_statement.validation)}
        />
        <div className="py-4"></div>
        <SlugTextField
          baseUrl={baseUrl}
          loading={validating}
          options={{
            label: config.slug.label,
            error: errors.slug?.message !== undefined,
            helperText: errors?.slug?.message ?? config.slug.help
          }}
          register={register('slug',config.slug.validation)}
        />
      </section>
      <section className='flex justify-end'>
        <Button
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
      </section>
    </form>
  )
}
