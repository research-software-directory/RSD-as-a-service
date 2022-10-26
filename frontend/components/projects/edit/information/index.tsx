// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth'
import {EditProject} from '~/types/Project'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useProjectContext from '../useProjectContext'
import useProjectToEdit from './useProjectToEdit'
import {projectInformation as config} from './config'
import AutosaveProjectTextField from './AutosaveProjectTextField'
import AutosaveProjectImage from './AutosaveProjectImage'
import AutosaveProjectMarkdown from './AutosaveProjectMarkdown'
import AutosaveControlledSwitch from './AutosaveControlledSwitch'
import AutosaveProjectPeriod from './AutosaveProjectPeriod'
import AutosaveFundingOrganisations from './AutosaveFundingOrganisations'
import AutosaveProjectKeywords from './AutosaveProjectKeywords'
import AutosaveResearchDomains from './AutosaveResearchDomains'
import AutosaveProjectLinks from './AutosaveProjectLinks'
import AutosaveControlledMarkdown from '~/components/form/AutosaveControlledMarkdown'
import {patchProjectTable} from './patchProjectInfo'

export default function EditProjectInformation({slug}: {slug: string}) {
  const {token,user} = useSession()
  const {loading, setLoading, setProjectInfo} = useProjectContext()
  const {reset, register, getValues, formState} = useFormContext<EditProject>()
  const {project} = useProjectToEdit({
    slug,
    token
  })
  // form data provided by react-hook-form
  const formValues = getValues()
  // NOTE! need to "subscribe" to dirty fields state
  // in order to detect first change using isDirty prop
  const {dirtyFields} = formState

  // load form and set copy of project info state
  useEffect(() => {
    if (project && loading===true) {
      // rest form to project values
      reset(project)
      // save copy to compare later
      // setProjectState(project)
      setProjectInfo({
        id: project.id,
        slug: project.slug,
        title: project.title
      })
      setLoading(false)
    }
  },[project,reset,loading,setProjectInfo,setLoading])

  // console.group('EditProjectInformation')
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.log('projectState...', projectState)
  // console.log('formValues...', formValues)
  // console.log('dirtyFields...', dirtyFields)
  // console.groupEnd()

  if (loading) {
    return (
      <ContentLoader />
    )
  }

  return (
    <form
      id="project-information"
      // onSubmit={handleSubmit(onSubmit)}
      className='flex-1'
    >
      {/* hidden inputs */}
      <input type="hidden"
        {...register('id',{required:'id is required'})}
      />
      <EditSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0 xl:gap-[3rem]'>
        {/* middle panel */}
        <div className="py-4 xl:pl-[3rem]">
          <EditSectionTitle
            title="Project information"
          />
          {user?.role === 'rsd_admin' ?
            <>
              <div className="py-2"></div>
              <AutosaveProjectTextField
                project_id={formValues.id}
                options={{
                  name: 'slug',
                  label: config.slug.label,
                  useNull: true,
                  defaultValue: project?.slug,
                  helperTextMessage: config.slug.help,
                  helperTextCnt: `${formValues?.slug?.length || 0}/${config.slug.validation.maxLength.value}`,
                }}
                rules={config.slug.validation}
              />
            </>
            :
            <input type="hidden"
              {...register('slug',{required:'slug is required'})}
            />
          }
          <div className="py-2"></div>
          <AutosaveProjectTextField
            project_id={formValues.id}
            rules={config.title.validation}
            options={{
              name: 'title',
              label: config.title.label,
              useNull: true,
              defaultValue: project?.title,
              helperTextMessage: config.title.help,
              helperTextCnt: `${formValues?.title?.length || 0}/${config.title.validation.maxLength.value}`,
            }}
          />
          <div className="py-2"></div>
          <AutosaveProjectTextField
            project_id={formValues.id}
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
            rules={config.subtitle.validation}
          />
          <div className="py-2"></div>
          <EditSectionTitle
            title={config.description.title}
            subtitle={config.description.subtitle}
          />
          <AutosaveProjectImage />
          <AutosaveControlledMarkdown
            id={formValues.id}
            name="description"
            maxLength={config.description.validation.maxLength.value}
            patchFn={patchProjectTable}
          />
          <div className="xl:py-4"></div>
        </div>
        {/* right panel */}
        <div className="py-4 min-w-[21rem] xl:my-0">
          <EditSectionTitle
            title="Status"
          />
          <div className="py-2"></div>
          <AutosaveControlledSwitch
            project_id={formValues.id}
            name='is_published'
            label={config.is_published.label}
            defaultValue={formValues.is_published}
          />
          <div className="py-4"></div>
          <AutosaveProjectPeriod
            date_start={project?.date_start ?? null}
            date_end={project?.date_end ?? null}
          />
          <div className="py-4"></div>
          <EditSectionTitle
            title={config.funding_organisations.title}
          />
          <div className="py-1"></div>
          <AutosaveProjectTextField
            project_id={formValues.id}
            options={{
              name:'grant_id',
              label: '',
              defaultValue: project?.grant_id ?? null,
              useNull: true,
              muiProps:{
                autoComplete: 'off',
                variant: 'standard',
                label: config.grant_id.label,
                sx: {
                  width: '20rem'
                }
              }
            }}
          />
          <div className="py-2"></div>
          <AutosaveFundingOrganisations
            id={project?.id ?? ''}
            items={project?.funding_organisations ?? []}
          />
          <div className="py-4"></div>
          {/* Project links */}
          <AutosaveProjectLinks
            project_id={project?.id ?? ''}
            url_for_project={project?.url_for_project ?? []}
          />
          {/* <ProjectLinks project={project?.id ?? ''} /> */}
          <div className="py-2"></div>
          {/* Research Domain */}
          <AutosaveResearchDomains
            project_id={project?.id ?? ''}
            research_domains={project?.research_domains ?? []}
          />
          {/* Keywords */}
          <EditSectionTitle
            title={config.keywords.title}
            subtitle={config.keywords.subtitle}
          />
          <AutosaveProjectKeywords
            project_id={project?.id ?? ''}
            items={project?.keywords ?? []}
          />
          <div className="py-4"></div>
        </div>
      </EditSection>
    </form>
  )
}
