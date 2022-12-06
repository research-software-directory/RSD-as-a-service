// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useMemo, useState} from 'react'
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
import {getSlugFromString} from '../../../utils/getSlugFromString'
import {validSoftwareItem} from '../../../utils/editSoftware'
import {useDebounce} from '~/utils/useDebounce'
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
  short_statement: string|null,
}

let lastValidatedSlug = ''
const formId = 'add-software-form'

export default function AddSoftwareCard() {
  const {session} = useAuth()
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')
  const [slugValue, setSlugValue] = useState('')
  const [validating, setValidating]=useState(false)
  const [state, setState] = useState(initalState)
  const {register, handleSubmit, watch, formState, setValue,setError} = useForm<AddSoftwareForm>({
    mode: 'onChange',
    defaultValues: {
      slug:'',
      brand_name: '',
      short_statement: null
    }
  })
  const {errors, isValid} = formState
  // watch for data change in the form
  const [slug,brand_name,short_statement] = watch(['slug', 'brand_name', 'short_statement'])
  // take the last slugValue
  const bouncedSlug = useDebounce(slugValue, 700)

  // console.group('AddSoftwareCard')
  // console.log('session...', session)
  // console.log('state...', state)
  // console.log('slug...', slug)
  // console.log('errors...', errors)
  // console.log('isValid...', isValid)
  // console.log('validating...', validating)
  // console.log('validSlug...', validSlug)
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
      // console.log('useEffect.slugValue...', slugValue)
      // update slugValue
      setSlugValue(slugValue)
    }
  }, [brand_name])
  /**
   * When bouncedSlug value is changed,
   * we need to update slug value (value in the input) shown to user.
   * This change occures when brand_name value is changed
   */
  useEffect(() => {
    if (bouncedSlug) {
      // console.log('useEffect.bouncedSlug...', bouncedSlug)
      setValue('slug', bouncedSlug, {
        shouldValidate: true
      })
    }
  }, [bouncedSlug,setValue])
  /**
   * When slug value is changed by debounce or manually by user
   * In addition to basic validations we also check if slug is already
   * used by existing software entries. I moved this validation here
   * because react-hook-form async validate function calls api 2 times.
   * Further investigation about this is needed. For now we move it here.
   */
  useEffect(() => {
    async function validateSlug() {
      setValidating(true)
      const isUsed = await validSoftwareItem(slug, session?.token)
      if (isUsed === true) {
        const message = `${slug} is already taken. Use letters, numbers and dash "-" to modify slug value.`
        setError('slug',{type:'validate',message})
      }
      lastValidatedSlug = slug
      setValidating(false)
    }
    if (slug !== lastValidatedSlug) {
      validateSlug()
    }
  },[slug,session?.token,setError])

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
    // if isValid is not true
    return isValid===false
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
              multiline:true,
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
    </ContentInTheMiddle>
  )
}
