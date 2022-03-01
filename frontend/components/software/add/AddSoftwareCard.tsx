import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useForm} from 'react-hook-form'

import {useAuth} from '../../../auth'
import TextFieldWithCounter from '../../form/TextFieldWithCounter'
import TextFieldWithLoader from '../../form/TextFieldWithLoader'
import ContentInTheMiddle from '../../layout/ContentInTheMiddle'
import {NewSoftwareItem} from '../../../types/SoftwareTypes'
import {getSlugFromString} from '../../../utils/getSlugFromString'
import {validSoftwareItem} from '../../../utils/editSoftware'
import {useDebounceValid} from '../../../utils/useDebouce'
import {addSoftware} from '../../../utils/editSoftware'
import {addConfig as config} from './addConfig'

const initalState = {
  open: false,
  loading: false,
  error:''
}

type AddSoftwareForm = {
  brand_name: string,
  short_statement: string,
}

export default function AddSoftwareCard() {
  const {session} = useAuth()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const router = useRouter()
  const [validating,setValidating]=useState(false)
  const [state, setState] = useState(initalState)
  const {register, handleSubmit, watch, formState, setError, clearErrors} = useForm<AddSoftwareForm>({
    mode: 'onChange',
    defaultValues: {
      brand_name: '',
      short_statement:''
    }
  })
  const {errors, isValid} = formState
  const brand_name = watch('brand_name')
  const bouncedName = useDebounceValid(brand_name,errors['brand_name'])

  useEffect(() => {
    let abort = false
    async function validateSlug(slug:string) {
      // console.log('validateSlug...', slug)
      const isValid = await validSoftwareItem(slug,session?.token)
      // debugger
      if (abort) return
      if (isValid) {
        setError('brand_name', {type: 'invalid-slug', message: `Slug is already taken: /software/${slug}`})
      } else {
        clearErrors('brand_name')
        setState(initalState)
      }
    }
    if (bouncedName) {
      setValidating(true)
      // debugger
      const slug = getSlugFromString(bouncedName)
      validateSlug(slug)
      // need to set timeout for loader to be visible
      // if the speed drops the timer can be removed
      setTimeout(() => {
        setValidating(false)
      },500)
    }
    return ()=>{abort=true}
  },[bouncedName,session?.token,setError,clearErrors])

  function handleCancel() {
    // on cancel we send user back to prevous page
    router.back()
  }

  function onSubmit(data: AddSoftwareForm) {
    // console.log('onSubmit...data', data)
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
      slug: getSlugFromString(data.brand_name),
      is_featured: false,
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

  function isSaveDisabled() {
    if (state.loading == true) return true
    // when manually setting errors, like with brand_name async validation
    // we also need to ensure these errors are handled here too
    if (errors && errors?.brand_name) return true
    if (isValid === false) return true
    return false
  }

  // construct slug from title
  const data = watch()
  const softwareSlug = getSlugFromString(data.brand_name)

  return (
    <ContentInTheMiddle>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-[42rem]">
        <section className="min-h-[6rem]">
          <h1 className="text-primary text-2xl mb-4">{config.title}</h1>
          {renderDialogText()}
        </section>
        <section className="py-8">
          <TextFieldWithLoader
            options={{
              autofocus:true,
              error: errors.brand_name?.message !== undefined,
              label: config.brand_name.label,
              helperTextMessage: errors?.brand_name?.message ?? config.brand_name.help(softwareSlug),
              helperTextCnt: `${data?.brand_name?.length || 0}/100`,
              variant:'outlined'
            }}
            register={register('brand_name', {
              ...config.brand_name.validation
            })}
            loading={validating}
          />
          <div className="py-4"></div>
          <TextFieldWithCounter
            options={{
              multiline:true,
              rows:5,
              error: errors?.short_statement?.message !== undefined,
              label: config.short_statement.label,
              helperTextMessage: errors?.short_statement?.message ?? config.short_statement.help,
              helperTextCnt: `${data?.short_statement?.length || 0}/300`,
              variant:'outlined'
            }}
            register={register('short_statement', config.short_statement.validation)}
          />
        </section>
        <section className='flex justify-end'>
          <Button
            tabIndex={1}
            onClick={handleCancel}
            color="secondary"
            sx={{marginRight:'2rem'}}
          >
            Cancel
          </Button>
          <Button
            tabIndex={0}
            type="submit"
            variant="contained"
            sx={{
              // overwrite tailwind preflight.css for submit type
              '&[type="submit"]:not(.Mui-disabled)': {
                backgroundColor:'primary.main'
              }
            }}
            endIcon={
              <SaveIcon />
            }
            disabled={isSaveDisabled()}
          >
            Save
          </Button>
        </section>
      </form>
    </ContentInTheMiddle>
  )
}
