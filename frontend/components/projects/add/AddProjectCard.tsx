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
import {getSlugFromString} from '../../../utils/getSlugFromString'
import {useDebounce} from '~/utils/useDebounce'
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

let lastValidatedSlug = ''
const formId='add-project-card-form'

export default function AddProjectCard() {
  const {session} = useAuth()
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')
  const [slugValue, setSlugValue] = useState('')
  const [validating, setValidating]=useState(false)
  const [state, setState] = useState(initalState)
  const {register, handleSubmit, watch, formState, setError, setValue} = useForm<AddProjectForm>({
    mode: 'onChange',
    defaultValues: {
      slug:'',
      project_title: '',
      project_subtitle:''
    }
  })
  const {errors, isValid, isDirty} = formState
  // watch for data change in the form
  const [slug,project_title,project_subtitle] = watch(['slug', 'project_title', 'project_subtitle'])
  // construct slug from title
  const bouncedSlug = useDebounce(slugValue,700)

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
      setSlugValue(slugValue)
    }
  }, [project_title])
  /**
   * When bouncedSlug value is changed,
   * we need to update slug value (value in the input) shown to user.
   * This change occures when brand_name value is changed
   */
  useEffect(() => {
    if (bouncedSlug) {
      setValue('slug', bouncedSlug, {
        shouldValidate: true
      })
    }
  }, [bouncedSlug, setValue])
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
      const isUsed = await validProjectItem(slug, session?.token)
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
    </ContentInTheMiddle>
  )
}
