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
import {NewProject} from '../../../types/Project'
import {getSlugFromString,sanitizeSlugValue} from '../../../utils/getSlugFromString'
import {useDebounceValid} from '~/utils/useDebounce'
import {addProject, validProjectItem} from '../../../utils/editProject'
import {addConfig as config} from './addProjectConfig'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'

const initalState = {
  loading: false,
  error:''
}

type AddProjectForm = {
  slug: string,
  project_title: string,
  project_subtitle: string,
}

const formId='add-project-card-form'

export default function AddProjectCard() {
  const {session} = useAuth()
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')
  const [slugValue, setSlugValue] = useState('')
  const [validating, setValidating]=useState(false)
  const [state, setState] = useState(initalState)
  const {register, handleSubmit, watch, formState, setError, setValue, clearErrors} = useForm<AddProjectForm>({
    mode: 'onChange',
    defaultValues: {
      slug:'',
      project_title: '',
      project_subtitle:''
    }
  })
  const {errors, isValid} = formState
  // watch for data change in the form
  const data = watch()
  // construct slug from title
  const bouncedSlug = useDebounceValid(slugValue, errors['slug'])

  useEffect(() => {
    if (typeof location != 'undefined') {
      setBaseUrl(`${location.origin}/projects/`)
    }
  }, [])

  useEffect(() => {
    const softwareSlug = getSlugFromString(data.project_title)
    clearErrors('slug')
    setSlugValue(softwareSlug)
  },[data.project_title,clearErrors])

  useEffect(() => {
    let abort = false
    async function validateSlug(slug: string) {
      setValidating(true)
      const isValid = await validProjectItem(slug, session?.token)
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

  function onSubmit(data: AddProjectForm) {
    const {token} = session
    // set flags
    if (token && data) {
      setState({
        ...state,
        loading: true,
        error:''
      })
    }
    // console.log('AddProjectCard.onSubmit...', data)
    // create data object
    const project:NewProject = {
      slug: data.slug,
      title: data.project_title,
      is_published: false,
      subtitle: data.project_subtitle,
      description: null,
      date_start: null,
      date_end: null,
      image_caption: null,
      grant_id: null
    }
    // add software to database
    addProject({
      project,
      token
    }).then(resp => {
      if (resp.status === 201) {
        // redirect to edit page
        // and remove software/add route from the history
        router.replace(`/projects/${project.slug}/edit`)
      } else {
        // show error
        setState({
          ...state,
          loading: false,
          error: `Failed to add project. Error: ${resp.message}`
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
    // when manually setting errors, like with brand_name async validation
    // we also need to ensure these errors are handled here
    if (errors && errors?.slug) return true
    if (isValid === false) return true
    return false
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

  return (
    <ContentInTheMiddle>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-[42rem]"
      >
        <section className="min-h-[6rem]">
          <h1 className="text-primary text-2xl mb-4">{config.title}</h1>
          {renderDialogText()}
        </section>
        <section className="py-8">
          <TextFieldWithCounter
            options={{
              autofocus:true,
              error: errors.project_title?.message !== undefined,
              label: config.project_title.label,
              helperTextMessage: errors?.project_title?.message ?? config.project_title.help,
              helperTextCnt: `${data?.project_title?.length ?? 0}/${config?.project_title?.validation?.maxLength?.value ?? 0}`,
              variant:'outlined'
            }}
            register={register('project_title', {
              ...config.project_title.validation
            })}
          />
          <div className="py-4"></div>
          <TextFieldWithCounter
            options={{
              multiline:true,
              rows:3,
              error: errors?.project_subtitle?.message !== undefined,
              label: config.project_subtitle.label,
              helperTextMessage: errors?.project_subtitle?.message ?? config.project_subtitle.help,
              helperTextCnt: `${data?.project_subtitle?.length ?? 0}/${config.project_subtitle?.validation?.maxLength?.value ?? 0}`,
              variant:'outlined'
            }}
            register={register('project_subtitle', config.project_subtitle.validation)}
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
            disabled={isSaveDisabled()}
            formId={formId}
          />
        </section>
      </form>
    </ContentInTheMiddle>
  )
}
