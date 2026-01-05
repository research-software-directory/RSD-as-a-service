// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'
import {useSession} from '~/auth/AuthProvider'
import AutosaveControlledMarkdown from '~/components/form/AutosaveControlledMarkdown'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {EditProject} from '~/types/Project'
import AutosaveFundingOrganisations from './AutosaveFundingOrganisations'
import AutosaveProjectImage from './AutosaveProjectImage'
import AutosaveProjectKeywords from './AutosaveProjectKeywords'
import AutosaveProjectLinks from './AutosaveProjectLinks'
import AutosaveProjectPeriod from './AutosaveProjectPeriod'
import AutosaveProjectSwitch from './AutosaveProjectSwitch'
import AutosaveProjectTextField from './AutosaveProjectTextField'
import AutosaveResearchDomains from './AutosaveResearchDomains'
import {projectInformation as config} from './config'
import {patchProjectTable} from './patchProjectInfo'
import PublishingProjectInfo from './PublishingProjectInfo'

export default function ProjectInformationForm({editProject}: {editProject: EditProject}) {
  const {user} = useSession()
  // const {loading, setLoading, setProjectInfo} = useProjectContext()
  const methods = useForm<EditProject>({
    mode: 'onChange',
    defaultValues: {
      ...editProject
    }
  })
  const {register, formState, watch} = methods
  // destructure formState (subscribe to changes)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {dirtyFields} = formState
  // watch form data changes (we use reset in useEffect)
  const formData = watch()

  // console.group('ProjectInformationForm')
  // console.log('editProject...', editProject)
  // console.log('formData...', formData)
  // console.groupEnd()

  return (
    <FormProvider {...methods}>
      <form
        id="project-information"
        data-testid="project-information-form"
        className='flex-1'
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id',{required:'id is required'})}
        />
        <EditSection className='xl:grid xl:grid-cols-[3fr_1fr] xl:px-0 xl:gap-[3rem]'>
          {/* middle panel */}
          <div className="py-2 overflow-hidden">
            <EditSectionTitle
              title={config.sectionTitle}
            />
            {user?.role === 'rsd_admin' ?
              <>
                <div className="py-2"></div>
                <AutosaveProjectTextField
                  project_id={formData.id}
                  options={{
                    name: 'slug',
                    label: config.slug.label,
                    useNull: true,
                    defaultValue: editProject?.slug,
                    helperTextMessage: config.slug.help,
                    helperTextCnt: `${formData?.slug?.length || 0}/${config.slug.validation.maxLength.value}`,
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
              project_id={formData.id}
              rules={config.title.validation}
              options={{
                name: 'title',
                label: config.title.label,
                useNull: true,
                defaultValue: editProject?.title,
                helperTextMessage: config.title.help,
                helperTextCnt: `${formData?.title?.length || 0}/${config.title.validation.maxLength.value}`,
              }}
            />
            <div className="py-2"></div>
            <AutosaveProjectTextField
              project_id={formData.id}
              options={{
                name: 'subtitle',
                label: config.subtitle.label,
                multiline: true,
                maxRows: 5,
                useNull: true,
                defaultValue: editProject?.subtitle,
                helperTextMessage: config.subtitle.help,
                helperTextCnt: `${formData?.subtitle?.length || 0}/${config.subtitle.validation.maxLength.value}`,
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
              id={formData.id}
              name="description"
              maxLength={config.description.validation.maxLength.value}
              patchFn={patchProjectTable}
            />
            <div className="xl:py-4"></div>
          </div>
          {/* right panel */}
          <div className="py-2 min-w-[21rem] xl:my-0">
            <EditSectionTitle
              title={config.pageStatus.title}
              subtitle={config.pageStatus.subtitle}
            />
            <AutosaveProjectSwitch
              project_id={formData.id}
              name='is_published'
              label={config.is_published.label}
              defaultValue={formData.is_published}
            />
            <PublishingProjectInfo />
            <div className="py-4"></div>
            <AutosaveProjectPeriod
              date_start={editProject?.date_start ?? null}
              date_end={editProject?.date_end ?? null}
            />
            <div className="py-4"></div>
            <EditSectionTitle
              title={config.funding_organisations.title}
              subtitle={config.funding_organisations.subtitle}
            />
            {/* <div className="py-2"></div> */}
            <AutosaveProjectTextField
              project_id={formData.id}
              options={{
                name:'grant_id',
                label: '',
                defaultValue: editProject?.grant_id ?? null,
                useNull: true,
                muiProps:{
                  autoComplete: 'off',
                  variant: 'outlined',
                  label: config.grant_id.label,
                  // sx: {
                  //   width: '20rem'
                  // }
                }
              }}
            />
            <div className="py-2"></div>
            <AutosaveFundingOrganisations
              id={editProject?.id ?? ''}
              items={editProject?.funding_organisations ?? []}
            />
            <div className="py-4"></div>
            {/* Project links */}
            <AutosaveProjectLinks
              project_id={editProject?.id ?? ''}
              url_for_project={editProject?.url_for_project ?? []}
            />
            {/* <ProjectLinks project={project?.id ?? ''} /> */}
            <div className="py-4"></div>
            {/* Research Domain */}
            <AutosaveResearchDomains
              project_id={editProject?.id ?? ''}
              research_domains={editProject?.research_domains ?? []}
            />
            <div className="py-4"></div>
            {/* Keywords */}
            <EditSectionTitle
              title={config.keywords.title}
              subtitle={config.keywords.subtitle}
            />
            <AutosaveProjectKeywords
              project_id={editProject?.id ?? ''}
              items={editProject?.keywords ?? []}
            />
            <div className="py-4"></div>
          </div>
        </EditSection>
      </form>
    </FormProvider>

  )
}
