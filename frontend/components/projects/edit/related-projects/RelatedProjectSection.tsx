// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {SearchProject} from '~/types/Project'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {relatedProject as config} from './config'
import FindRelatedProject from './FindRelatedProject'
import RelatedProjectList, {RelatedProjectProps} from './RelatedProjectList'

type RelatedProjectSectionProp=Readonly<{
  projectId: string,
  token: string,
  relatedProject?: RelatedProjectProps[],
  onRemove:(pos:number)=>void
  onAdd: (item: SearchProject) => void
  onCreate?: (keyword: string) => void
}>

export default function RelatedProjectSection(props:RelatedProjectSectionProp){
  // destructure props
  const {relatedProject,projectId,token,onRemove,onAdd,onCreate} = props

  return (
    <EditSection className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]">
      <section
        aria-label={`${relatedProject?.length ?? 0} ${config.title}`}
        className="py-4">
        <EditSectionTitle
          title={config.title}
        >
          {/* add count to title */}
          {relatedProject && relatedProject.length > 0 ?
            <div className="pl-4 text-2xl">{relatedProject.length}</div>
            : null
          }
        </EditSectionTitle>
        <RelatedProjectList
          projects={relatedProject}
          onRemove={onRemove}
        />
      </section>
      <section
        aria-label={config.findTitle}
        className="py-4">
        <EditSectionTitle
          title={config.findTitle}
          subtitle={config.findSubtitle}
        />
        <FindRelatedProject
          project={projectId}
          token={token}
          config={{
            freeSolo: false,
            minLength: config.validation.minLength,
            label: config.label,
            help: config.help,
            reset: true
          }}
          onAdd={onAdd}
          onCreate={onCreate}
        />
      </section>
    </EditSection>
  )
}
