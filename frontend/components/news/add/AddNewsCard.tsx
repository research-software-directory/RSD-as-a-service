// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import {useForm} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {useDebounce} from '~/utils/useDebounce'
import {getSlugFromString} from '~/utils/getSlugFromString'
import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import SlugTextField from '~/components/form/SlugTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledTextField from '~/components/form/ControlledTextField'
import {AddNewsItem, addNewsItem, validSlugNews} from '~/components/news/apiNews'
import {newsConfig as config} from './newsConfig'

type AddNewsForm = {
  title: string|null,
  slug: string|null,
  publication_date: string|null
}

const formId='add-news-form'

const initialState = {
  loading: false,
  error:''
}

export default function AddNewsCard() {
  const {token} = useSession()
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')
  const [validating, setValidating]=useState(false)
  const [state, setState] = useState(initialState)
  const {register, control, handleSubmit, watch, formState, setError, setValue,clearErrors} = useForm<AddNewsForm>({
    mode: 'onChange',
    defaultValues:{
      title: null,
      slug: null,
      // default is today in the format YYYY-MM-DD (sv-SE locale)
      publication_date: new Date().toLocaleDateString('sv-SE')
    }
  })
  const {errors, isValid} = formState
  // watch for data change in the form
  const [slug,title,publication_date] = watch(['slug','title','publication_date'])
  // construct slug from title
  const bouncedSlug = useDebounce(slug ?? '',700)

  // console.group('AddNewsCard')
  // console.log('publication_date...', publication_date)
  // console.log('isValid...', isValid)
  // console.groupEnd()

  useEffect(() => {
    if (typeof location != 'undefined') {
      setBaseUrl(`${location.origin}/news/${publication_date}/`)
      clearErrors('slug')
    }
  }, [publication_date,clearErrors])

  /**
   * Convert title value into slugValue.
   * The title is then debounced and produces bouncedSlug
   * We use bouncedSlug value later on to perform call to api
   */
  useEffect(() => {
    if (title){
      const slugValue = getSlugFromString(title)
      // update slugValue
      setValue('slug',slugValue,{shouldValidate:true,shouldDirty:true})
    }
  }, [title, setValue])

  /**
   * When bouncedSlug value is changed by debounce we check if slug is already
   * used by existing news entries.
   */
  useEffect(() => {
    let abort = false
    async function validateSlug() {
      const isUsed = await validSlugNews({
        date: publication_date ?? '',
        slug: bouncedSlug,
        token
      })
      if (abort) return
      if (isUsed === true) {
        const message = `${publication_date}/${bouncedSlug} is already taken. Use letters, numbers and dash "-" to modify slug value or change publication date.`
        setError('slug', {
          type: 'validate',
          message
        })
      }
      // we need to wait some time
      setValidating(false)
    }

    if (bouncedSlug && publication_date &&
      bouncedSlug===slug
    ) {
      validateSlug()
    } else if (!slug){
      // fix: remove validating/spinner when no slug
      setValidating(false)
    }
    return ()=>{abort=true}
  },[bouncedSlug,publication_date,slug,token,setError])

  useEffect(()=>{
    // As soon as the slug value start changing we signal to user that we need to validate new slug.
    // New slug value is "debounced" into variable bouncedSlug after the user stops typing.
    // Another useEffect monitors bouncedSlug value and performs the validation.
    // Validating flag disables Save button from the moment the slug value is changed until the validation is completed.
    if (slug && !errors?.title && !errors?.slug){
      // debugger
      setValidating(true)
    }
  },[slug,publication_date,errors?.title,errors?.slug])

  function handleCancel() {
    // on cancel we send user back to previous page
    router.back()
  }

  function onSubmit(data: AddNewsForm) {
    // console.log('onSubmit...', data)
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
        // and remove /add/news route from the history
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
              slotProps:{
                inputLabel:{
                  shrink: true
                }
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
