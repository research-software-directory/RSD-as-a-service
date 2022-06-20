// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

import {useForm} from 'react-hook-form'

import {useAuth} from '../../../auth'
import TextFieldWithCounter from '../../form/TextFieldWithCounter'
import SlugTextField from '../../form/SlugTextField'
import ContentInTheMiddle from '../../layout/ContentInTheMiddle'
import {NewSoftwareItem} from '../../../types/SoftwareTypes'
import {getSlugFromString,sanitizeSlugValue} from '../../../utils/getSlugFromString'
import {validSoftwareItem} from '../../../utils/editSoftware'
import {useDebounceValid} from '~/utils/useDebounce'
import {addSoftware} from '../../../utils/editSoftware'
import {addConfig as config} from './addConfig'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'

const initalState = {
  loading: false,
  error:''
}

type AddSoftwareForm = {
  slug: string,
  brand_name: string,
  short_statement: string,
}

const formId='add-software-form'

export default function AddSoftwareCard() {
  const {session} = useAuth()
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')
  const [slugValue, setSlugValue] = useState('')
  const [validating, setValidating]=useState(false)
  const [state, setState] = useState(initalState)
  const {register, handleSubmit, watch, formState, setError, setValue, clearErrors} = useForm<AddSoftwareForm>({
    mode: 'onChange',
    defaultValues: {
      slug:'',
      brand_name: '',
      short_statement:''
    }
  })
  const {errors, isValid} = formState
  // watch for data change in the form
  const data = watch()
  // construct slug from title
  const bouncedSlug = useDebounceValid(slugValue, errors['slug'])

  useEffect(() => {
    if (typeof location != 'undefined') {
      setBaseUrl(`${location.origin}/software/`)
    }
  }, [])

  useEffect(() => {
    const softwareSlug = getSlugFromString(data.brand_name)
    clearErrors('slug')
    setSlugValue(softwareSlug)
  },[data.brand_name,clearErrors])

  useEffect(() => {
    let abort = false
    async function validateSlug(slug: string) {
      setValidating(true)
      const isValid = await validSoftwareItem(slug, session?.token)
      // debugger
      if (abort) return
      if (isValid) {
        setError('slug', {
          type: 'invalid-slug',
          message: `${slug} is already taken. Use letters, numbers and dash "-" to modify slug value.`
        })
      } else {
        clearErrors('slug')
        setValue('slug', slug, {
          shouldValidate: true
        })
      }
      // we need to wait some time
      setValidating(false)
    }
    if (bouncedSlug) {
      // debugger
      validateSlug(bouncedSlug)
    }
    return ()=>{abort=true}
  },[bouncedSlug,session?.token,setError,setValue,clearErrors])

  function handleCancel() {
    // on cancel we send user back to prevous page
    router.back()
  }

  function onSubmit(data: AddSoftwareForm) {
    const {token} = session
    // set flags
    if (token && data) {
      setState({
        ...state,
        loading: true,
        error:''
      })
    }
    // create data object
    const software:NewSoftwareItem = {
      brand_name: data.brand_name,
      short_statement: data.short_statement,
      slug: data.slug,
      is_published: false,
      description: null,
      description_type: 'markdown',
      description_url: null,
      get_started_url: null,
      concept_doi: null
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

  function onSlugChange(slug: string) {
    // if nothing is changed
    const newSlug = sanitizeSlugValue(slug)
    if (newSlug === slugValue) return
    if (newSlug.length < config.slug.validation.minLength.value) {
      setError('slug',{
        type: 'invalid-slug',
        message: config.slug.validation.minLength.message
      })
    } else {
      // clear errors
      if (errors?.slug) clearErrors('slug')
    }
    // save new value
    setSlugValue(newSlug)
  }

  function isSaveDisabled() {
    if (state.loading == true) return true
    // when manually setting errors, like with brand_name async validation
    // we also need to ensure these errors are handled here
    if (errors && errors?.slug) return true
    if (isValid === false) return true
    return false
  }

  return (
    <ContentInTheMiddle>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-[42rem]">
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
              helperTextCnt: `${data?.brand_name?.length || 0}/${config.brand_name.validation.maxLength.value}`,
              variant:'outlined'
            }}
            register={register('brand_name', {
              ...config.brand_name.validation
            })}
          />
          <div className="py-4"></div>
          <TextFieldWithCounter
            options={{
              multiline:true,
              rows:5,
              error: errors?.short_statement?.message !== undefined,
              label: config.short_statement.label,
              helperTextMessage: errors?.short_statement?.message ?? config.short_statement.help,
              helperTextCnt: `${data?.short_statement?.length || 0}/${config.short_statement.validation.maxLength.value}`,
              variant:'outlined'
            }}
            register={register('short_statement', config.short_statement.validation)}
          />
          <div className="py-4"></div>
          <SlugTextField
            label={config.slug.label}
            baseUrl={baseUrl}
            value={slugValue}
            error={errors.slug?.message !== undefined}
            helperTextMessage={errors?.slug?.message ?? config.slug.help}
            onSlugChange={onSlugChange}
            loading={validating}
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
    </ContentInTheMiddle>
  )
}
