import {useEffect, useState, useContext} from 'react'
import {useForm} from 'react-hook-form'

import ContentLoader from '../../layout/ContentLoader'
import snackbarContext from '../../snackbar/PageSnackbarContext'
import TextFieldWithCounter from '../../form/TextFieldWithCounter'
import {updateSoftwareInfo} from '../../../utils/editSoftware'
import {EditSoftwareItem} from '../../../types/SoftwareTypes'
import EditSoftwareSection from './EditSoftwareSection'
import EditSoftwareStickyHeader from './EditSoftwareStickyHeader'
import EditSectionTitle from './EditSectionTitle'
import editSoftwareContext from './editSoftwareContext'
import {EditSoftwareActionType} from './editSoftwareContext'
import SoftwareMarkdown from './SoftwareMarkdown'
import SoftwareKeywords from './SoftwareKeywords'
import SoftwareLicenses from './SoftwareLicenses'
import SoftwarePageStatus from './SoftwarePageStatus'
import {editConfigStep1 as config} from './editConfig'
import useEditSoftwareData from '../../../utils/useEditSoftwareData'

export default function SoftwareInformation({slug,token}:{slug:string,token: string}) {
  const {options: snackbarOptions, setSnackbar} = useContext(snackbarContext)
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)
  const {loading:apiLoading, editSoftware, setEditSoftware} = useEditSoftwareData({slug,token})
  const [loading, setLoading] = useState(true)
  // destructure methods from react-hook-form
  const {register, handleSubmit, watch, formState, reset, control, setValue} = useForm<EditSoftwareItem>({
    mode: 'onChange',
    defaultValues: {
      ...editSoftware
    }
  })
  // destructure formState
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
  // console.log('editSoftware...', editSoftware)
  // console.groupEnd()

  useEffect(() => {
    if (editSoftware?.id && apiLoading === false) {
      // set data into form
      reset(editSoftware)
      // share with other steps
      dispatchPageState({
        type: EditSoftwareActionType.UPDATE_STATE,
        payload: {
          software: {
            slug,
            id: editSoftware?.id ?? '',
            brand_name: editSoftware?.brand_name ?? ''
          },
          loading:false
        }
      })
      // remove loading flag
      setLoading(false)
    }
  },[reset,editSoftware,apiLoading,slug,dispatchPageState])

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

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  function onSubmit(formData: EditSoftwareItem) {
    updateSoftwareInfo({
      software: formData,
      tagsInDb: editSoftware?.tags || [],
      licensesInDb: editSoftware?.licenses || [],
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
        setEditSoftware(formData)
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
        brand_name={formData?.brand_name ?? ''}
        isCancelDisabled={!isDirty}
        isSaveDisabled={isSaveDisabled()}
        onCancel={() => {
          // reset back to inital
          reset(editSoftware)
        }}
      />
      <EditSoftwareSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <EditSectionTitle
            title="Software information"
          />
          <TextFieldWithCounter
            options={{
              error: errors?.brand_name?.message !== undefined,
              label: config.brand_name.label,
              helperTextMessage: errors?.brand_name?.message ?? config.brand_name.help,
              helperTextCnt:`${formData?.brand_name?.length || 0}/${config.brand_name.validation.maxLength.value}`
            }}
            register={register('brand_name',config.brand_name.validation)}
          />
          <div className="py-2"></div>
          <TextFieldWithCounter
            options={{
              multiline:true,
              maxRows:5,
              error: errors?.short_statement?.message !== undefined,
              label: config.short_statement.label,
              helperTextMessage: errors?.short_statement?.message ?? config.short_statement.help,
              helperTextCnt:`${formData?.short_statement?.length || 0}/${config.short_statement.validation.maxLength.value}`
            }}
            register={register('short_statement',config.short_statement.validation)}
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
              helperTextCnt:`${formData?.get_started_url?.length || 0}/${config.get_started_url.validation.maxLength.value}`
            }}
            register={register('get_started_url', config.get_started_url.validation)}
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
                : 0}/${config.repository_url.validation.maxLength.value}`
            }}
            register={register('repository_url.0.url', config.repository_url.validation )}
          />

          <div className="py-2"></div>
          <SoftwareMarkdown
            register={register}
            errors={errors}
            config={config}
            formData={formData}
          />

          {/* add white space at the bottom */}
          <div className="py-4"></div>
        </div>
        <div className="py-4 xl:my-0">
          <SoftwarePageStatus
            formData={formData}
            config={config}
            control={control}
          />
          <div className="py-4"></div>
          <EditSectionTitle
            title="Citation"
          />
          <TextFieldWithCounter
            options={{
              error: errors?.concept_doi?.message !== undefined,
              label: config.concept_doi.label,
              helperTextMessage: errors?.concept_doi?.message ?? config.concept_doi.help,
              helperTextCnt:`${formData?.concept_doi?.length || 0}/${config.concept_doi.options.maxLength.value}`
            }}
            register={register('concept_doi', config.concept_doi.options)}
          />

          <div className="py-4"></div>
          <EditSectionTitle
            title="Keywords"
          />
          <SoftwareKeywords control={control}/>

          <div className="py-4"></div>
          <EditSectionTitle
            title="Licenses"
            subtitle="What licenses do apply to your software?"
          />
          <SoftwareLicenses control={control} />
          {/* <div className="py-4"></div>           */}
        </div>
      </EditSoftwareSection>
    </form>
  )
}
