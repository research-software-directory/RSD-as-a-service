// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import {useForm} from 'react-hook-form'

import {useAuth} from '~/auth'
import {useDebounce} from '~/utils/useDebounce'
import {getSlugFromString} from '~/utils/getSlugFromString'
import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import SlugTextField from '~/components/form/SlugTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {AddNewsItem, addNewsItem, validSlugNews} from '~/components/news/apiNews'
import {newsConfig as config} from './newsConfig'
import ControlledTextField from '~/components/form/ControlledTextField'

type AddNewsForm = {
  title: string|null,
  slug: string|null,
  publication_date: string|null
}

const formId='add-news-form'
let lastValidatedSlug = ''

const initialState = {
  loading: false,
  error:''
}

export default function AddNewsCard() {
  const {session} = useAuth()
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')
  const [slugValue, setSlugValue] = useState('')
  const [validating, setValidating]=useState(false)
  const [state, setState] = useState(initialState)
  const {register, control, handleSubmit, watch, formState, setError, setValue, clearErrors} = useForm<AddNewsForm>({
    mode: 'onChange',
    defaultValues:{
      title: null,
      slug: null,
      // default is today in the format YYYY-MM-DD (en-CA locale)
      publication_date: new Date().toLocaleDateString('sv-SE')
    }
  })
  const {errors, isValid} = formState
  // watch for data change in the form
  const [slug,title,publication_date] = watch(['slug','title','publication_date'])
  // construct slug from title
  const bouncedSlug = useDebounce(slugValue,700)

  // console.group('AddNewsCard')
  // console.log('publication_date...', publication_date)
  // console.log('isValid...', isValid)
  // console.groupEnd()


  useEffect(() => {
    if (typeof location != 'undefined') {
      setBaseUrl(`${location.origin}/news/${publication_date}/`)
    }
  }, [publication_date])

  /**
   * Convert title value into slugValue.
   * The title is then debounced and produces bouncedSlug
   * We use bouncedSlug value later on to perform call to api
   */
  useEffect(() => {
    if (title){
      const softwareSlug = getSlugFromString(title)
      setSlugValue(softwareSlug)
    }
  }, [title])
  /**
   * When bouncedSlug value is changed,
   * we need to update slug value (value in the input) shown to user.
   * This slug changes when the title value is changed
   */
  useEffect(() => {
    if (bouncedSlug){
      setValue('slug', bouncedSlug, {
        shouldValidate: true
      })
    }
  }, [bouncedSlug, setValue])

  useEffect(() => {
    let abort = false

    async function validateSlug() {
      if (slug===null || publication_date===null) return
      setValidating(true)
      const isUsed = await validSlugNews({
        date: publication_date,
        slug,
        token: session?.token
      })
      // if (abort) return
      if (isUsed === true) {
        const message = `${publication_date}/${slug} is already taken. Use letters, numbers and dash "-" to modify slug value or change publication date.`
        setError('slug', {
          type: 'validate',
          message
        })
      }
      lastValidatedSlug = `${publication_date}/${slug}`
      // we need to wait some time
      setValidating(false)
    }

    if (`${publication_date}/${slug}` !== lastValidatedSlug) {
      clearErrors()
      // debugger
      validateSlug()
    }
    return ()=>{abort=true}
  },[slug,publication_date,session?.token,setError,clearErrors])

  function handleCancel() {
    // on cancel we send user back to previous page
    router.back()
  }

  function onSubmit(data: AddNewsForm) {
    // console.log('onSubmit...', data)
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
    // const slug = `${data.publication_date}/${data.slug}`
    const page: AddNewsItem = {
      title: data.title ?? '',
      slug: data.slug ?? '',
      publication_date: data.publication_date ?? ''
    }
    // add page to database
    addNewsItem({
      page,
      token
    }).then(resp => {
      if (resp.status === 200) {
        // redirect to edit page
        // and remove software/add route from the history
        router.replace(`/news/${page.publication_date}/${page.slug}/edit`)
      } else {
        // show error
        setState({
          ...state,
          loading: false,
          error: `Failed to add page. Error: ${resp.message}`
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
    if (state.loading == true) return true
    // during async validation we disable button
    if (validating === true) return true
    // if isValid is not true
    return isValid===false
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full md:w-[42rem] mx-auto">
      <section className="min-h-[6rem]">
        <h1 className="text-primary text-2xl mb-4">{config.page_title}</h1>
        {renderDialogText()}
      </section>
      <section className="py-8">
        <ControlledTextField
          options={{
            name: 'publication_date',
            label: config.publication_date.label,
            useNull: true,
            defaultValue: publication_date,
            helperTextMessage: config.publication_date.help,
            // helperTextCnt: `${item?.publication_date?.length || 0}/${config.slug.validation.maxLength.value}`,
            muiProps:{
              autoComplete: 'off',
              variant: 'outlined',
              label: config.publication_date.label,
              type: 'date',
              InputLabelProps:{
                shrink: true
              },
              sx:{
                maxWidth:'13rem'
              }
            }
          }}
          control={control}
          rules={config.publication_date.validation}
        />
        <div className="py-4"></div>
        <TextFieldWithCounter
          options={{
            autofocus:true,
            error: errors.title?.message !== undefined,
            label: config.title.label,
            helperTextMessage: errors?.title?.message ?? config.title.help,
            helperTextCnt: `${title?.length || 0}/${config.title.validation.maxLength.value}`,
            variant:'outlined'
          }}
          register={register('title', {
            ...config.title.validation
          })}
        />
        <div className="py-4"></div>
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
