// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState, useContext} from 'react'
import {useFieldArray, useForm} from 'react-hook-form'

import {useAuth} from '~/auth'
import {app} from '~/config/app'
import {EditSoftwareItem} from '~/types/SoftwareTypes'
import {updateSoftwareInfo} from '~/utils/editSoftware'
import useEditSoftwareData from '~/utils/useEditSoftwareData'
import useOnUnsaveChange from '~/utils/useOnUnsavedChange'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ControlledTextField from '~/components/form/ControlledTextField'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import editSoftwareContext from '../editSoftwareContext'
import {EditSoftwareActionType} from '../editSoftwareContext'
import SoftwareMarkdown from './SoftwareMarkdown'
import SoftwareLicenses from './SoftwareLicenses'
import SoftwarePageStatus from './SoftwarePageStatus'
import {softwareInformation as config} from '../editSoftwareConfig'
import RepositoryPlatform from './RepositoryPlatform'
import SoftwareKeywords from './SoftwareKeywords'
import {getKeywordChanges} from './softwareKeywordsChanges'
import ConceptDoi from './ConceptDoi'

export default function SoftwareInformation(
  {slug, token}: {slug: string, token: string}
) {
  const {session} = useAuth()
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)
  const {loading: apiLoading, editSoftware, setEditSoftware} = useEditSoftwareData({slug, token})
  const [loading, setLoading] = useState(true)

  // destructure methods from react-hook-form
  const {
    register, handleSubmit, watch, formState, reset,
    control, setValue, getValues
  } = useForm<EditSoftwareItem>({
    mode: 'onChange',
    defaultValues: {
      ...editSoftware
    }
  })

  const {update: updateKeyword} = useFieldArray({
    control,
    name: 'keywords'
  })

  // destructure formState
  const {isDirty, isValid, errors} = formState
  // form data provided by react-hook-form
  const formData = watch()
  // watch for unsaved changes
  useOnUnsaveChange({
    isDirty,
    isValid,
    warning: app.unsavedChangesMessage
  })

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
            brand_name: editSoftware?.brand_name ?? '',
            concept_doi: editSoftware?.concept_doi ?? '',
          },
          loading: false
        }
      })
      setLoading(false)
    }
  }, [reset, editSoftware, apiLoading, slug, dispatchPageState])

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
          isValid,
        }
      })
    }
  }, [isDirty, isValid, pageState, dispatchPageState])

  // console.group('SoftwareInformation')
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('pageState...', pageState)
  // console.groupEnd()

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  async function onSubmit(formData: EditSoftwareItem) {
    // get all keyword changes (create,add,delete)
    const keywords = getKeywordChanges({
      updateKeyword,
      formData,
      previousState: editSoftware
    })
    // console.log('onSubmit.keywords...', keywords)
    // save all changes
    const resp = await updateSoftwareInfo({
      software: formData,
      keywords,
      licensesInDb: editSoftware?.licenses || [],
      repositoryInDb: editSoftware?.repository_url ?? null,
      repositoryPlatform: editSoftware?.repository_platform ?? null,
      token
    })
    // if OK
    if (resp.status === 200) {
      showSuccessMessage(`${formData?.brand_name} saved`)
      // update software state
      // reset form to remove dirty states with latest form data
      const latestFormData = getValues()
      // to be equal to data in the form
      setEditSoftware(latestFormData)
      dispatchPageState({
        type: EditSoftwareActionType.SET_SOFTWARE_INFO,
        payload: {
          id: formData?.id,
          slug,
          brand_name:formData?.brand_name
        }
      })
    } else {
      showErrorMessage(`Failed to save. ${resp.message}`)
    }
  }

  return (
    <form
      id={pageState.step?.formId}
      onSubmit={handleSubmit(onSubmit)}
      className='flex-1'>
      {/* hidden inputs */}
      <input type="hidden"
        {...register('id', {required:'id is required'})}
      />
      <input type="hidden"
        {...register('slug', {required:'slug is required'})}
      />
      <EditSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <EditSectionTitle
            title="Software information"
          />
          {session?.user?.role === 'rsd_admin' ?
            <>
              <div className="py-2"></div>
              <ControlledTextField
                options={{
                  name: 'slug',
                  label: config.slug.label,
                  useNull: true,
                  defaultValue: editSoftware?.slug,
                  helperTextMessage: config.slug.help,
                  helperTextCnt: `${formData?.slug?.length || 0}/${config.slug.validation.maxLength.value}`,
                }}
                control={control}
                rules={config.slug.validation}
              />
            </>
            :null
          }
          <div className="py-2"></div>
          <ControlledTextField
            options={{
              name: 'brand_name',
              label: config.brand_name.label,
              useNull: true,
              defaultValue: editSoftware?.brand_name,
              helperTextMessage: config.brand_name.help,
              helperTextCnt: `${formData?.brand_name?.length || 0}/${config.brand_name.validation.maxLength.value}`,
            }}
            control={control}
            rules={config.brand_name.validation}
          />
          <div className="py-2"></div>
          <ControlledTextField
            options={{
              name: 'short_statement',
              label: config.short_statement.label,
              multiline: true,
              maxRows: 5,
              useNull: true,
              defaultValue: editSoftware?.short_statement,
              helperTextMessage: config.short_statement.help,
              helperTextCnt: `${formData?.short_statement?.length || 0}/${config.short_statement.validation.maxLength.value}`,
            }}
            control={control}
            rules={config.short_statement.validation}
          />
          <div className="py-2"></div>
          <EditSectionTitle
            title='Software URLs'
            subtitle='Where can users find information to start?'
          />
          <ControlledTextField
            options={{
              name: 'get_started_url',
              label: config.get_started_url.label,
              useNull: true,
              defaultValue: editSoftware?.get_started_url,
              helperTextMessage: config.get_started_url.help,
              helperTextCnt: `${formData?.get_started_url?.length || 0}/${config.get_started_url.validation.maxLength.value}`,
            }}
            control={control}
            rules={config.get_started_url.validation}
          />
          <div className="py-2"></div>
          <div className="flex items-baseline">
            <ControlledTextField
              options={{
                name: 'repository_url',
                label: config.repository_url.label,
                useNull: true,
                defaultValue: editSoftware?.repository_url,
                helperTextMessage: config.repository_url.help,
                helperTextCnt: `${formData?.repository_url?.length || 0}/${config.repository_url.validation.maxLength.value}`,
              }}
              control={control}
              rules={config.repository_url.validation}
            />
            <RepositoryPlatform
              label={config.repository_platform.label}
              control={control}
              options={config.repository_platform.options}
              watch={watch}
              setValue={setValue}
              errors={errors}
              defaultValue={editSoftware?.repository_platform ?? null}
              sx={{
                m: 1,
                width: '7rem'
              }}
            />
          </div>
          <div className="py-2"></div>
          <SoftwareMarkdown
            control={control}
            register={register}
            config={config}
            defaultDescriptionUrl={editSoftware?.description_url ?? null}
            formData={formData}
          />

          {/* add white space at the bottom */}
          <div className="xl:py-4"></div>
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <SoftwarePageStatus
            formData={formData}
            config={config}
            control={control}
          />
          <div className="py-4"></div>
          <EditSectionTitle
            title={config.concept_doi.title}
            subtitle={config.concept_doi.subtitle}
          />

          <ConceptDoi
            control={control}
            setValue={setValue}
          />

          <div className="py-4"></div>
          <EditSectionTitle
            title={config.keywords.title}
            subtitle={config.keywords.subtitle}
          />

          <SoftwareKeywords
            software={formData.id}
            control={control}
            concept_doi={formData.concept_doi ?? undefined}
          />

          <div className="py-4"></div>
          <EditSectionTitle
            title={config.licenses.title}
            subtitle={config.licenses.subtitle}
          />

          <SoftwareLicenses
            control={control}
            software={pageState.software.id ?? ''}
            concept_doi={formData.concept_doi ?? undefined}
          />

          {/* add white space at the bottom */}
          <div className="py-4"></div>
        </div>
      </EditSection>
    </form>
  )
}
