import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'

import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'
import {useForm} from 'react-hook-form'

import {useAuth} from '../../../auth'
import {SoftwareTableItem} from '../../../types/SoftwareItem'
import {editSoftware} from '../../../utils/editSoftware'
import ContentInTheMiddle from '../../layout/ContentInTheMiddle'
import EditSoftwareSection from './EditSoftwareSection'
import EditSectionTitle from './EditSectionTitle'
import SoftwareDescription from './SoftwareDescription'
import TextFieldWithCounter from '../../form/TextFieldWithCounter'

const config = {
  brand_name: {
    label: 'Name',
    help: 'Provide software name to use as a title of your software page.',
    required: 'Name is required',
  },
  short_statement: {
    label: 'Short description',
    help: 'Provide short description of your software to use as page subtitle.',
    required: 'Name is required',
  },
  get_started_url: {
    label: 'Get Started Url',
    help: 'Link to software repo, documentation or starting point web page.',
    // required: 'Name is required',
  }
}


export default function SoftwareInformation() {
  const {session} = useAuth()
  const router = useRouter()
  const slug = router.query['slug']?.toString()
  const [loading, setLoading] = useState(false)
  const [software, setSoftware] = useState<SoftwareTableItem>()
  const {token} = session

  const {register, handleSubmit, watch, formState, reset} = useForm<SoftwareTableItem>({
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
      editSoftware({slug, token})
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

  function onSubmit(data: SoftwareTableItem) {
    console.log('save data...', data)
  }

  function resetForm(software:SoftwareTableItem|undefined) {
    // debugger
    if (software) {
      reset({
        id: software?.id,
        slug: software?.slug,
        brand_name: software?.brand_name,
        short_statement: software?.short_statement,
        get_started_url: software?.get_started_url ?? '',
        description: software?.description
      })
    } else {
      reset()
    }
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
      <EditSoftwareSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0'>
        <div className="py-4 xl:px-8">
          <EditSectionTitle
            title="Software information"
          >
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
              minLength: {value: 10, message: 'Minimum length is 10'},
              maxLength: {value: 200, message: 'Maximum length is 200'},
            })}
          />

          <div className="py-2"></div>
          <EditSectionTitle
            title="Description"
            subtitle={`What <strong>${software?.brand_name}</strong> can do for your users?`}
          />

          <SoftwareDescription
            markdown={data?.description||''}
            register={register('description')}
          />
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
