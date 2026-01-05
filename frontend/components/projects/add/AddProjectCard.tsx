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
import {NewProject} from '~/types/Project'
import {getSlugFromString} from '~/utils/getSlugFromString'
import {useDebounce} from '~/utils/useDebounce'
import {addProject, validProjectItem} from '~/components/projects/edit/apiEditProject'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import SlugTextField from '~/components/form/SlugTextField'
import {addConfig as config} from './addProjectConfig'

const initialState = {
  loading: false,
  error:''
}

type AddProjectForm = {
  slug: string,
  project_title: string,
  project_subtitle: string|null,
}

const formId='add-project-card-form'

export default function AddProjectCard() {
  const {token} = useSession()
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')
  const [validating, setValidating]=useState(false)
  const [state, setState] = useState(initialState)
  const {register, handleSubmit, watch, formState, setError, setValue} = useForm<AddProjectForm>({
    mode: 'onChange'
  })
  const {errors, isValid} = formState
  // watch for data change in the form
  const [slug,project_title,project_subtitle] = watch(['slug', 'project_title', 'project_subtitle'])
  // construct slug from title
  const bouncedSlug = useDebounce(slug,700)

  // console.group('AddProjectCard')
  // console.log('slug...', slug)
  // console.log('lastValidatedSlug...', lastValidatedSlug)
  // console.log('bouncedSlug...', bouncedSlug)
  // console.log('errors...', errors)
  // console.log('isValid...', isValid)
  // console.log('validating...', validating)
  // console.groupEnd()

  useEffect(() => {
    if (typeof location != 'undefined') {
      setBaseUrl(`${location.origin}/projects/`)
    }
  }, [])

  /**
   * Convert project_title value into slugValue.
   * The slugValue is then debounced and produces bouncedSlug
   * We use bouncedSlug value later on to perform call to api
   */
  useEffect(() => {
    // construct slug from title
    if (project_title) {
      const slugValue = getSlugFromString(project_title)
      // update slugValue
      setValue('slug',slugValue,{shouldValidate:true,shouldDirty:true})
    }
  }, [project_title, setValue])

  /**
   * When bouncedSlug value is changed by debounce we check if slug is already
   * used by existing project entries.
   */
  useEffect(() => {
    let abort = false
    async function validateSlug() {
      const isUsed = await validProjectItem(bouncedSlug, token)
      if (abort) return
      if (isUsed === true) {
        const message = `${bouncedSlug} is already taken. Use letters, numbers and dash "-" to modify slug value.`
        setError('slug',{type:'validate',message})
      }
      setValidating(false)
    }
    if (bouncedSlug && token && bouncedSlug === slug) {
      validateSlug()
    }else if (!slug){
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
    if (slug && !errors?.project_title && !errors?.slug){
      // debugger
      setValidating(true)
    }
  },[slug,errors?.project_title,errors?.slug])

  function handleCancel() {
    // on cancel we send user back to previous page
    router.back()
  }

  function onSubmit(data: AddProjectForm) {
    // set flags
    if (token && data) {
      setState({
        ...state,
        loading: true,
        error:''
      })
    }
    // ensure null value
    if (data.project_subtitle==='') data.project_subtitle=null
    // create data object
    const project: NewProject = {
      slug: data.slug,
      title: data.project_title,
      is_published: false,
      subtitle: data.project_subtitle,
      description: null,
      date_start: null,
      date_end: null,
      image_caption: null,
      image_contain: false,
      grant_id: null,
      image_id: null
    }
    // add project to database
    addProject({
      project,
      token
    }).then(resp => {
      if (resp.status === 201) {
        // redirect to edit page
        // and remove /add/project route from the history
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
      className="w-full md:w-[42rem] mx-auto"
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
            helperTextCnt: `${project_title?.length ?? 0}/${config?.project_title?.validation?.maxLength?.value ?? 0}`,
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
            helperTextCnt: `${project_subtitle?.length ?? 0}/${config.project_subtitle?.validation?.maxLength?.value ?? 0}`,
            variant:'outlined'
          }}
          register={register('project_subtitle', config.project_subtitle.validation)}
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
          register={register('slug', config.slug.validation)}
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
  )
}
