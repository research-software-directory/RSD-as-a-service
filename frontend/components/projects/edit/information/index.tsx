// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {useFieldArray, useFormContext} from 'react-hook-form'

import {Session} from '~/auth'
import {EditProject, ProjectTableProps} from '~/types/Project'
import {updateProjectInfo} from '~/utils/editProject'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ControlledTextField from '~/components/form/ControlledTextField'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import MarkdownInputWithPreview from '~/components/form/MarkdownInputWithPreview'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import ControlledTextInput from '~/components/form/ControlledTextInput'
import useProjectContext from '../useProjectContext'
import useProjectToEdit from './useProjectToEdit'
import {projectInformation as config} from './config'
import ProjectImage from './ProjectImage'
import ProjectPeriod from './ProjectPeriod'
import ProjectLinks from './ProjectLinks'
import FundingOrganisations from './FundingOrganisations'
import ProjectKeywords from './ProjectKeywords'
import {getProjectLinkChanges, ProjectLinksForSave} from './projectLinkChanges'
import {FundingOrganisationsForSave, getFundingOrganisationChanges} from './fundingOrganisationsChanges'
import {getProjectImageChanges} from './projectImageChanges'
import {getKeywordChanges, KeywordsForSave} from './projectKeywordsChanges'
import ResearchDomain from './ResearchDomains'
import {getResearchDomainChanges} from './researchDomainChanges'

export type ProjectImageInfo = {
  action: 'add'|'update'|'delete'|'none'
  id: string,
  image_b64: string|null,
  image_mime_type: string|null
}

export default function EditProjectInformation({slug, session}: { slug: string, session: Session }) {
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {handleSubmit, reset, register, control, getFieldState, setValue, getValues,formState} = useFormContext<EditProject>()
  const {step, loading, setLoading, setProjectInfo} = useProjectContext()
  const {loading:apiLoading, project} = useProjectToEdit({
    slug,
    token: session?.token ?? ''
  })
  const {update:updateOrganisation} = useFieldArray({
    control,
    name:'funding_organisations'
  })
  const {update:updateUrl} = useFieldArray({
    control,
    name:'url_for_project'
  })
  const {update:updateKeyword} = useFieldArray({
    control,
    name:'keywords'
  })

  // const researchFields = useResearchFieldOptions()
  // local state for keeping track what is deleted since last save
  const [projectState,setProjectState]=useState<EditProject>()

  // form data provided by react-hook-form
  // const formData = watch()
  const formValues = getValues()

  useEffect(() => {
    // sync loading values
    if (loading !== apiLoading) {
      setLoading(apiLoading)
      if (project) {
        // set shared project info
        setProjectInfo({
          id: project.id,
          slug: project.slug,
          title: project.title
        })
        // set local state
        setProjectState(project)
        // set project values in the form
        reset({
          ...project
        })
      }
    }
  }, [
    loading,
    apiLoading,
    setLoading,
    project,
    setProjectInfo,
    reset
  ])

  // console.group('EditProjectInformation')
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.log('projectState...', projectState)
  // console.log('formValues...', formValues)
  // console.log('formState...', formState)
  // console.groupEnd()

  if (loading || apiLoading) {
    return (
      <ContentLoader />
    )
  }

  function prepareFormDataForSave(formData: EditProject) {
    // NOTE! update ProjectTableProps when project table structure change
    const updatedProject = getPropsFromObject(formData, ProjectTableProps)
    // get project url states, what items to add, delete and update
    const projectLinks: ProjectLinksForSave = getProjectLinkChanges({
      updateUrl,
      formData,
      getValues,
      getFieldState,
      projectState,
      formState
    })
    //project image "actions", inital values
    const projectImage: ProjectImageInfo = getProjectImageChanges({
      formData,
      projectState
    })
    // funding organisations
    const fundingOrganisations: FundingOrganisationsForSave = getFundingOrganisationChanges({
      updateOrganisation,
      formData,
      previousState:projectState,
    })
    // research domains
    const researchDomains = getResearchDomainChanges({
      project: project?.id,
      formData,
      projectState
    })
    // keywords
    const keywords: KeywordsForSave = getKeywordChanges({
      formData,
      previousState:projectState,
      updateKeyword
    })
    return {
      project: updatedProject,
      projectImage,
      fundingOrganisations,
      researchDomains,
      keywords,
      projectLinks,
    }
  }

  async function onSubmit(formData: EditProject) {
    // extract data for update from the form
    const {
      project, projectLinks, projectImage,
      fundingOrganisations, keywords,
      researchDomains
    } = prepareFormDataForSave(formData)
    const resp = await updateProjectInfo({
      project,
      projectLinks,
      projectImage,
      fundingOrganisations,
      researchDomains,
      keywords,
      session
    })
    // show messages
    if (resp.status === 200) {
      // update image properties after save
      if (projectImage.action === 'add' ||
        projectImage.action === 'update') {
        if (formData.image_id === null) {
          // update image_id after save
          setValue('image_id',projectImage.id)
        }
        // remove base64 data after save
        if (formData.image_b64 !== null) {
          setValue('image_b64', null)
          setValue('image_mime_type',null)
        }
      }
      // reset form to remove dirty states with latest form data
      const latestFormData = getValues()
      // debugger
      reset(latestFormData)
      // update local state
      setProjectState({
        ...latestFormData
      })
      // show success message
      showSuccessMessage(`Saved ${formData.title}`)
    } else {
      showErrorMessage(`Failed to save project. ${resp.message}`)
    }
  }

  return (
    <form
      id={step?.formId}
      onSubmit={handleSubmit(onSubmit)}
      className='flex-1'
    >
      {/* hidden inputs */}
      <input type="hidden"
        {...register('id',{required:'id is required'})}
      />
      <input type="hidden"
        {...register('slug',{required:'slug is required'})}
      />
      <EditSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0 xl:gap-[3rem]'>
        {/* middle panel */}
        <div className="py-4 xl:pl-[3rem]">
          <EditSectionTitle
            title="Project information"
          />
          {session?.user?.role === 'rsd_admin' ?
            <>
              <div className="py-2"></div>
              <ControlledTextField
                options={{
                  name: 'slug',
                  label: config.slug.label,
                  useNull: true,
                  defaultValue: project?.slug,
                  helperTextMessage: config.slug.help,
                  helperTextCnt: `${formValues?.slug?.length || 0}/${config.slug.validation.maxLength.value}`,
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
              name: 'title',
              label: config.title.label,
              useNull: true,
              defaultValue: project?.title,
              helperTextMessage: config.title.help,
              helperTextCnt: `${formValues?.title?.length || 0}/${config.title.validation.maxLength.value}`,
            }}
            control={control}
            rules={config.title.validation}
          />
          <div className="py-2"></div>
          <ControlledTextField
            options={{
              name: 'subtitle',
              label: config.subtitle.label,
              multiline: true,
              maxRows: 5,
              useNull: true,
              defaultValue: project?.subtitle,
              helperTextMessage: config.subtitle.help,
              helperTextCnt: `${formValues?.subtitle?.length || 0}/${config.subtitle.validation.maxLength.value}`,
            }}
            control={control}
            rules={config.subtitle.validation}
          />
          <div className="py-2"></div>
          <EditSectionTitle
            title={config.description.title}
            subtitle={config.description.subtitle}
          />
          <ProjectImage />
          <MarkdownInputWithPreview
            markdown={formValues?.description || ''}
            register={register('description', {
              maxLength: config.description.validation.maxLength.value
            })}
            disabled={false}
            helperInfo={{
              length: formValues?.description?.length ?? 0,
              maxLength: config.description.validation.maxLength.value
            }}
          />
          <div className="xl:py-4"></div>
        </div>
        {/* right panel */}
        <div className="py-4 min-w-[21rem] xl:my-0">
          <EditSectionTitle
            title="Status"
          />
          <div className="py-2"></div>
          <ControlledSwitch
            name='is_published'
            label={config.is_published.label}
            control={control}
            defaultValue={formValues.is_published}
          />
          <div className="py-4"></div>
          <ProjectPeriod
            date_start={project?.date_start ?? null}
            date_end={project?.date_end ?? null}
          />
          <div className="py-4"></div>
          <EditSectionTitle
            title={config.funding_organisations.title}
          />
          <div className="py-1"></div>
          <ControlledTextInput
            name="grant_id"
            defaultValue={project?.grant_id ?? null}
            control={control}
            muiProps={{
              autoComplete: 'off',
              variant: 'standard',
              label: config.grant_id.label,
              sx: {
                width: '20rem'
              }
            }}
          />
          <div className="py-2"></div>
          <FundingOrganisations />
          <div className="py-4"></div>
          {/* Project links */}
          <ProjectLinks project={project?.id ?? ''} />
          <div className="py-2"></div>
          {/* Research Domain */}
          <ResearchDomain />
          {/* Keywords */}
          <EditSectionTitle
            title={config.keywords.title}
            subtitle={config.keywords.subtitle}
          />
          <ProjectKeywords project={project?.id ?? ''} />
          <div className="py-4"></div>
        </div>
      </EditSection>
    </form>
  )
}
