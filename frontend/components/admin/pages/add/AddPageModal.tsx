// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import {useForm} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {getSlugFromString} from '~/utils/getSlugFromString'
import {useDebounce} from '~/utils/useDebounce'
import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {useSaveDisabledFormState} from '~/components/form/useSaveDisabledFormState'
import SlugTextField from '~/components/form/SlugTextField'
import {MarkdownPage, validPageSlug} from '../useMarkdownPages'
import {addMarkdownPage} from '../saveMarkdownPage'
import {addConfig as config} from './addConfig'

const initialState = {
  loading: false,
  error:''
}

type AddPageForm = {
  slug: string,
  title: string
}

type AddPageModalProps = {
  pos: number,
  open: boolean,
  onCancel: () => void,
  onSuccess: (page:MarkdownPage) => void
}

let lastValidatedSlug = ''
const formId='add-page-form'

export default function AddPageModal({open,onCancel,onSuccess,pos}:AddPageModalProps) {
  const {token} = useSession()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const [baseUrl, setBaseUrl] = useState('')
  const [slugValue, setSlugValue] = useState('')
  const [validating, setValidating]=useState(false)
  const [state, setState] = useState(initialState)
  const {register, handleSubmit, watch, formState, setError, setValue, reset} = useForm<AddPageForm>({
    mode: 'onChange',
    defaultValues: {
      slug:'',
      title: ''
    }
  })
  // use hook to decide if save buttons should be disabled
  const saveDisabled = useSaveDisabledFormState(formState)
  const {errors} = formState
  // watch for data change in the form
  const [slug,title] = watch(['slug','title'])
  // construct slug from title
  const bouncedSlug = useDebounce(slugValue,700)

  useEffect(() => {
    if (typeof location != 'undefined') {
      setBaseUrl(`${location.origin}/page/`)
    }
  }, [])

  /**
   * Convert title value into slugValue.
   * The title is then debounced and produces bouncedSlug
   * We use bouncedSlug value later on to perform call to api
   */
  useEffect(() => {
    const softwareSlug = getSlugFromString(title)
    setSlugValue(softwareSlug)
  }, [title])
  /**
   * When bouncedSlug value is changed,
   * we need to update slug value (value in the input) shown to user.
   * This change occures when brand_name value is changed
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
      const isUsed = await validPageSlug({slug, token})
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

  function handleClose() {
    // rest form values
    reset()
    // reset validation flag
    setValidating(false)
    // reset local state
    setState(initialState)
    // send cancel signal
    onCancel()
  }

  function onSubmit(data: AddPageForm) {
    // set flags
    if (token && data) {
      setState({
        ...state,
        loading: true,
        error:''
      })
    }
    // create data object
    const page: MarkdownPage = {
      position: pos ?? 1,
      title: data.title,
      slug: data.slug,
      is_published: false
    }
    // add page to database
    addMarkdownPage({
      page,
      token
    }).then(resp => {
      if (resp.status === 200) {
        // return created item
        onSuccess(resp.message)
        handleClose()
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

  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        {config.page_title}
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full">

        <DialogContent>
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
        <DialogActions>
          {/*
            Button order in the default styles is reversed to achieve following goal:
            First button in the tab order is first button at right side
          */}
          <SubmitButtonWithListener
            formId={formId}
            disabled={saveDisabled}
          />
          <Button
            onClick={handleClose}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
