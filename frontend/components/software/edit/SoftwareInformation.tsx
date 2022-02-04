import {useEffect, useState, useContext, useCallback} from 'react'
import {useForm} from 'react-hook-form'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

import ContentLoader from '../../layout/ContentLoader'
import TextFieldWithCounter from '../../form/TextFieldWithCounter'
import MarkdownInputWithPreview from '../../form/MarkdownInputWithPreview'
import {updateSoftwareInfo} from '../../../utils/editSoftware'
import snackbarContext from '../../snackbar/PageSnackbarContext'
import EditSoftwareSection from './EditSoftwareSection'
import EditSectionTitle from './EditSectionTitle'
import RemoteMarkdownPreview from '../../form/RemoteMarkdownPreview'
import {getSoftwareToEdit} from '../../../utils/editSoftware'
import EditSoftwareStickyHeader from './EditSoftwareStickyHeader'
import {SoftwareItem} from '../../../types/SoftwareItem'
import editSoftwareContext from './editSoftwareContext'
import {EditSoftwareActionType} from './editSoftwareContext'

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
    help: (brand_name:string)=>`What ${brand_name} can do for you`
  },
  description_url: {
    label: 'Url to markdown file',
    help: 'Point to the location of markdown file including the filename.'
  },
}

export default function SoftwareInformation({slug,token}:{slug:string,token: string}) {
  const {options: snackbarOptions, setSnackbar} = useContext(snackbarContext)
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)
  const [software, setSoftware] = useState<SoftwareItem>()
  // destructure methods from react-form-hook
  const {register, handleSubmit, watch, formState, reset} = useForm<SoftwareItem>({
    mode: 'onChange'
  })
  // destructure formState
  const {errors, isDirty, isValid} = formState
  // destructure pageState
  const {loading} = pageState
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
  // console.log('editState...', state)
  // console.groupEnd()

  const resetForm = useCallback(() => {
    if (software) {
      reset(software)
    } else {
      reset()
    }
  }, [reset, software])

  useEffect(() => {
    let abort = false
    if (slug && token) {
      // setLoading(true)
      dispatchPageState({
        type: EditSoftwareActionType.SET_LOADING,
        payload: {loading: true}
      })
      getSoftwareToEdit({slug, token})
        .then(data => {
          // debugger
          // exit on abort
          if (abort) return
          // set data
          setSoftware(data)
          dispatchPageState({
            type: EditSoftwareActionType.UPDATE_STATE,
            payload: {
              software: {
                slug,
                id: data?.id ?? '',
                brand_name: data?.brand_name ?? ''
              },
              loading:false
            }
          })
        })
    }
    return ()=>{abort=true}
  }, [slug,token,dispatchPageState])

  useEffect(() => {
    // update form state
    // only if values are different (avoid loop)
    if (
      pageState?.isDirty !== isDirty ||
      pageState?.isValid !== isValid
    ) {
      dispatchPageState({
        type: EditSoftwareActionType.UPDATE_STATE,
        payload: {
          isDirty,
          isValid
        }
      })
    }
  },[isDirty,isValid,pageState,dispatchPageState])

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
      token
    }).then(resp => {
      // if OK
      if (resp.status === 200) {
        setSnackbar({
          ...snackbarOptions,
          open: true,
          severity: 'success',
          message: `${formData?.brand_name} saved`,
        })
        // update software state
        // to be equal to data in the form
        setSoftware(formData)
        dispatchPageState({
          type: EditSoftwareActionType.SET_SOFTWARE_INFO,
          payload: {
            id: formData?.id,
            slug,
            brand_name:formData?.brand_name
          }
        })
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
      <EditSoftwareStickyHeader
        brand_name={software?.brand_name ?? ''}
        isCancelDisabled={!isDirty}
        isSaveDisabled={isSaveDisabled()}
        onCancel={resetForm}
      />
      <EditSoftwareSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0'>
        <div className="py-4 xl:px-8">
          <EditSectionTitle
            title="Software information"
          />
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
            subtitle={config.description.help(software?.brand_name ?? '')}
          />

          <RadioGroup
            row
            aria-labelledby="radio-group"
            value={formData?.description_type ?? 'markdown'}
            defaultValue={formData?.description_type ?? 'markdown'}
          >
            <FormControlLabel
              label="Document url"
              value="link"
              defaultValue={'link'}
              control={<Radio {...register('description_type')} />}
            />
            <div className="py-2"></div>

            <FormControlLabel
              label="Custom markdown"
              value="markdown"
              defaultValue={'markdown'}
              control={<Radio {...register('description_type')}/>}
            />
          </RadioGroup>

          {renderMarkdownComponents()}

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

  function renderMarkdownComponents() {
    if (formData?.description_type === 'link') {
      return (
         <RemoteMarkdownPreview
          url={formData?.description_url ?? ''}
          label={config.description_url.label}
          help={config.description_url.help}
          errors={errors?.description_url}
          register={register('description_url', {
            maxLength: {value: 200, message: 'Maximum length is 200'},
            pattern: {
              value: /^https?:\/\/.+\..+.md$/,
              message: 'Url should start with http(s):// have at least one dot (.) and end with (.md)'
            }
          })}
        />
      )
    }
    // default is custom markdown
    return (
      <>
        <div className="py-4"></div>
        <MarkdownInputWithPreview
          markdown={formData?.description || ''}
          register={register('description')}
          disabled={formData?.description_type !== 'markdown'}
          // autofocus={data.description_type === 'markdown'}
        />
      </>
    )
  }
}
