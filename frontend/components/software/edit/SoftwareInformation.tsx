import {useEffect, useState, useContext, useCallback} from 'react'
import {useRouter} from 'next/router'

import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'
import {useForm} from 'react-hook-form'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

import {useAuth} from '../../../auth'
import {SoftwareItem} from '../../../types/SoftwareItem'
import {getSoftwareToEdit} from '../../../utils/editSoftware'
import ContentLoader from '../../layout/ContentLoader'
import TextFieldWithCounter from '../../form/TextFieldWithCounter'
import MarkdownInputWithPreview from '../../form/MarkdownInputWithPreview'
import {updateSoftwareInfo} from '../../../utils/editSoftware'
import snackbarContext from '../../snackbar/PageSnackbarContext'
import EditSoftwareSection from './EditSoftwareSection'
import EditSectionTitle from './EditSectionTitle'

const config = {
  brand_name: {
    label: 'Name',
    help: 'Provide software name to use as a title of your software page.',
    required: 'Name is required',
  },
  short_statement: {
    label: 'Short description',
    help: 'Provide short description of your software to use as page subtitle.',
    required: 'Short description is required',
  },
  get_started_url: {
    label: 'Get Started Url',
    help: 'Link to source code repository or documentation web page.',
  },
  repository_url: {
    label: 'Repository Url',
    help: 'Link to source code repository',
  },
  description: {
    label: 'Description',
    help: 'What your software can do for your users?'
  },
  description_url: {
    label: 'Url to markdown file',
    help: 'Point to the location of markdown file including the filename.'
  },
}

export default function SoftwareInformation() {
  const {session} = useAuth()
  const {token} = session
  const {options:snackbarOptions, setSnackbar} = useContext(snackbarContext)
  const router = useRouter()
  const slug = router.query['slug']?.toString()
  const [loading, setLoading] = useState(false)
  // store data received from backend
  const [software, setSoftware] = useState<SoftwareItem>()
  // destructure methods from react-form-hook
  const {register, handleSubmit, watch, formState, reset} = useForm<SoftwareItem>({
    mode: 'onChange'
  })
  // destructure form states
  const {errors, isDirty, isValid} = formState
  // form data provided by react-hook-form
  const formData = watch()

  // console.group('SoftwareInformation')
  // console.log('token...', token)
  // console.log('slug...', slug)
  // console.log('loading...', loading)
  // console.log('errors...', errors)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('formData...', formData)
  // console.log('software...', software)
  // console.groupEnd()

  const resetForm = useCallback(() => {
    if (software) {
      reset(software)
    } else {
      reset()
    }
  },[reset,software])

  useEffect(() => {
    let abort = false
    if (slug && token) {
      setLoading(true)
      getSoftwareToEdit({slug, token})
        .then(data => {
          // exit on abort
          if (abort) return
          // set data
          setSoftware(data)
          setLoading(false)
        })
    }
    ()=>{abort=true}
  }, [slug, token])

  useEffect(() => {
    // update form values
    // when software changes
    if (software?.id) {
      resetForm()
    }
  }, [
    software?.id,
    software?.slug,
    software?.brand_name,
    software?.short_statement,
    software?.get_started_url,
    software?.description,
    software?.description_url,
    software?.description_type,
    software?.concept_doi,
    software?.is_featured,
    software?.is_published,
    resetForm
  ])

  if (loading) return (
    <ContentLoader />
  )

  function onSubmit(formData: SoftwareItem) {
    updateSoftwareInfo({
      software: formData,
      token: session.token
    }).then(resp => {
      // if OK
      if (resp.status === 200) {
        setSnackbar({
          ...snackbarOptions,
          open: true,
          severity: 'success',
          message: `${software?.brand_name} saved`,
        })
        // update software state
        // to equal data in the form
        setSoftware(formData)
      } else {
        setSnackbar({
          ...snackbarOptions,
          open: true,
          severity: 'error',
          message: resp.message
        })
      }
    })
  }

  function isSaveDisabled() {
    if (isDirty === false || isValid === false) {
      return true
    }
    return false
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex-1'>
      {/* hidden inputs */}
      <input type="hidden"
        {...register('id',{required:'id is required'})}
      />
      <input type="hidden"
        {...register('slug',{required:'slug is required'})}
      />
      <div className="flex pl-8 py-4 w-full">
        <h1 className="flex-1 text-primary">{software?.brand_name}</h1>
        <div>
          <Button
            tabIndex={0}
            type="submit"
            onClick={resetForm}
            disabled={!isDirty}
            sx={{
              marginRight:'2rem'
            }}
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
        </div>
      </div>
      <EditSoftwareSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0'>
        <div className="py-4 xl:px-8">
          <EditSectionTitle
            title="Software information"
          >
          </EditSectionTitle>

          <TextFieldWithCounter
            options={{
              error: errors?.brand_name?.message !== undefined,
              label: config.brand_name.label,
              helperTextMessage: errors?.brand_name?.message ?? config.brand_name.help,
              helperTextCnt:`${formData?.brand_name?.length || 0}/100`
            }}
            register={register('brand_name', {
              required: config.brand_name.required,
              minLength: {value: 3, message: 'Minimum length is 3'},
              maxLength: {value: 100, message: 'Maximum length is 100'},
            })}
          />
          <div className="py-2"></div>
          <TextFieldWithCounter
            options={{
              multiline:true,
              maxRows:5,
              error: errors?.short_statement?.message !== undefined,
              label: config.short_statement.label,
              helperTextMessage: errors?.short_statement?.message ?? config.short_statement.help,
              helperTextCnt:`${formData?.short_statement?.length || 0}/300`
            }}
            register={register('short_statement', {
              required: config.short_statement.required,
              minLength: {value: 10, message: 'Minimum length is 10'},
              maxLength: {value: 300, message: 'Maximum length is 300'},
            })}
          />

          <div className="py-2"></div>
          <EditSectionTitle
            title='Project URL'
            subtitle='Where users can find the information to start?'
          />
          <TextFieldWithCounter
            options={{
              error: errors?.get_started_url?.message !== undefined,
              label: config.get_started_url.label,
              helperTextMessage: errors?.get_started_url?.message ?? config.get_started_url.help,
              helperTextCnt:`${formData?.get_started_url?.length || 0}/200`
            }}
            register={register('get_started_url', {
              maxLength: {value: 200, message: 'Maximum length is 200'},
              pattern: {
                value: /^https?:\/\/.+\..+/,
                message:'Url should start with http(s):// and use at least one dot (.)'
              }
            })}
          />
          <div className="py-2"></div>
          <TextFieldWithCounter
            options={{
              error: errors?.repository_url !== undefined,
              label: config.repository_url.label,
              helperTextMessage: errors?.repository_url !== undefined
                ? errors?.repository_url[0]?.url?.message
                : config.repository_url.help,
              helperTextCnt: `${formData?.repository_url?.length > 0
                ? formData?.repository_url[0]?.url?.length
                : 0}/200`
            }}
            register={register('repository_url.0.url', {
              maxLength: {value: 200, message: 'Maximum length is 200'},
              pattern: {
                value: /^https?:\/\/.+\..+/,
                message:'Url should start with htps://, have at least one dot (.) and at least one slash (/).'
              }
            })}
          />

          <div className="py-2"></div>
          <EditSectionTitle
            title={config.description.label}
            subtitle={config.description.help}
          />

          <RadioGroup
            aria-labelledby="radio-group"
            value={formData?.description_type}
            defaultValue={formData?.description_type}
          >
            <FormControlLabel
              label="Use markdown from this url"
              value="link"
              control={<Radio {...register('description_type')} />}
            />

            <TextFieldWithCounter
              options={{
                // autofocus: formData?.description_type === 'link',
                disabled: formData?.description_type !== 'link',
                error: errors?.description_url !== undefined,
                label: config.description_url.label,
                helperTextMessage: errors?.description_url?.message ?? config.description_url.help,
                helperTextCnt:`${formData?.description_url?.length || 0}/200`
              }}
              register={register('description_url', {
                maxLength: {value: 200, message: 'Maximum length is 200'},
                pattern: {
                  value: /^https?:\/\/.+\..+.md$/,
                  message:'Url should start with http(s):// have at least one dot (.) and end with (.md)'
                }
              })}
            />
            <div className="py-2"></div>

            <FormControlLabel
              label="New markdown"
              value="markdown"
              control={<Radio {...register('description_type')}/>}
            />
          </RadioGroup>

          <MarkdownInputWithPreview
            markdown={formData?.description || ''}
            register={register('description')}
            disabled={formData?.description_type !== 'markdown'}
            // autofocus={data.description_type === 'markdown'}
          />
          {/* add white space at the bottom */}
          <div className="py-4"></div>
        </div>
        <div className="py-4 xl:my-0">
          <EditSectionTitle
            title="Citation"
          />
        </div>
      </EditSoftwareSection>
    </form>
  )
}
