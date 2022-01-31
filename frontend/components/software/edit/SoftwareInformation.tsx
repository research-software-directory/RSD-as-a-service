import {useEffect, useState, useContext} from 'react'
import {useRouter} from 'next/router'

import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'
import {useForm} from 'react-hook-form'

import {useAuth} from '../../../auth'
import {SoftwareItem} from '../../../types/SoftwareItem'
import {getSoftwareToEdit} from '../../../utils/editSoftware'
import ContentInTheMiddle from '../../layout/ContentInTheMiddle'
import EditSoftwareSection from './EditSoftwareSection'
import EditSectionTitle from './EditSectionTitle'
import SoftwareDescription from './SoftwareDescription'
import TextFieldWithCounter from '../../form/TextFieldWithCounter'
import {updateSoftwareInfo} from '../../../utils/editSoftware'
import snackbarContext from '../../snackbar/PageSnackbarContext'

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
    help: 'Link to software repo, documentation or starting point web page.',
  },
  repository_url: {
    label: 'Repository Url',
    help: 'Link to source code repository',
  },
  description: {
    label: 'Description',
    help:'What your software can do for your users?'
  }
}

export default function SoftwareInformation() {
  const {session} = useAuth()
  const {setSnackbar} = useContext(snackbarContext)
  const router = useRouter()
  const slug = router.query['slug']?.toString()
  const [loading, setLoading] = useState(false)
  const [software, setSoftware] = useState<SoftwareItem>()
  const {token} = session

  const {register, handleSubmit, watch, formState, reset} = useForm<SoftwareItem>({
    mode: 'onChange'
  })

  const {errors, isDirty, isValid} = formState
  const data = watch()

  console.group('SoftwareInformation')
  console.log('errors...', errors)
  console.log('isDirty...', isDirty)
  console.log('isValid...', isValid)
  console.log('data...', data)
  console.groupEnd()

  useEffect(() => {
    if (slug && token) {
      setLoading(true)
      getSoftwareToEdit({slug, token})
        .then(data => {
          // debugger
          setSoftware(data)
          setLoading(false)
        })
    }
  }, [slug, token])

  useEffect(() => {
    // debugger
    if (software) {
      // update form values
      // when software changes
      resetForm(software)
    }
  },[software])


  if (loading) return (
    <ContentInTheMiddle>
      <CircularProgress />
    </ContentInTheMiddle>
  )

  function onSubmit(data: SoftwareItem) {
    // console.log('save data...', data)
    updateSoftwareInfo({
      software: data,
      token: session.token
    }).then(resp => {
      // debugger
      // console.log('resp...', resp)
      if (resp.status === 200) {
        setSnackbar({
          open: true,
          severity: 'success',
          message: `${software?.brand_name} saved`,
          duration: 5000,
          anchor: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        })
        // reset form
        resetForm(data)
      } else {
        setSnackbar({
          open: true,
          severity: 'error',
          message: resp.message,
          anchor: {
            vertical: 'top',
            horizontal: 'right'
          }
        })
      }
    })
  }

  function resetForm(software:SoftwareItem|undefined) {
    // debugger
    if (software) {
      reset({
        id: software?.id,
        slug: software?.slug,
        brand_name: software?.brand_name,
        short_statement: software?.short_statement,
        get_started_url: software?.get_started_url,
        description: software?.description,
        concept_doi: software?.concept_doi,
        is_featured: software?.is_featured,
        is_published: software?.is_published,
        repository_url: software?.repository_url
      })
    } else {
      reset()
    }
  }

  function repositoryUrlHelp() {

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
            onClick={()=>resetForm(software)}
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
            disabled={!isDirty}
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
              helperTextCnt:`${data?.brand_name?.length || 0}/100`
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
              helperTextCnt:`${data?.short_statement?.length || 0}/300`
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
              helperTextCnt:`${data?.get_started_url?.length || 0}/200`
            }}
            register={register('get_started_url', {
              // minLength: {value: 10, message: 'Minimum length is 10'},
              maxLength: {value: 200, message: 'Maximum length is 200'},
              pattern: {
                value: /https?:\/\/\w+\.\w+\//,
                message:'Url should start with htps://, have at least one dot (.) and at least one slash (/).'
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
                : config.get_started_url.help,
              helperTextCnt: `${data?.repository_url?.length > 0
                ? data?.repository_url[0]?.url?.length
                : 0}/200`
            }}
            register={register('repository_url.0.url', {
              // minLength: {value: 10, message: 'Minimum length is 10'},
              maxLength: {value: 200, message: 'Maximum length is 200'},
              pattern: {
                value: /https?:\/\/\w+\.\w+\//,
                message:'Url should start with htps://, have at least one dot (.) and at least one slash (/).'
              }
            })}
          />

          <div className="py-2"></div>
          <EditSectionTitle
            title={config.description.label}
            subtitle={config.description.help}
          />
          <SoftwareDescription
            markdown={data?.description||''}
            register={register('description')}
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
