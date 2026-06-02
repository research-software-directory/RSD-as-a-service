// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {SearchSoftware} from '~/types/SoftwareTypes'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import EditSection from '~/components/layout/EditSection'
import {relatedSoftware as config} from '~/components/software/edit/related-software/config'
import FindRelatedSoftware from './FindRelatedSoftware'
import RelatedSoftwareList,{RelatedSoftwareProps} from './RelatedSoftwareList'

type RelatedSoftwareSectionProp=Readonly<{
  softwareId: string,
  token: string,
  relatedSoftware?: RelatedSoftwareProps[],
  onRemove:(pos:number)=>void
  onAdd: (item: SearchSoftware) => void
  onCreate?: (keyword: string) => void
}>

export default function RelatedSoftwareSection(props:RelatedSoftwareSectionProp){
  // destructure props
  const {relatedSoftware,softwareId,token,onRemove,onAdd,onCreate} = props

  return (
    <EditSection className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]">
      <section
        aria-label={`${relatedSoftware?.length ?? 0} ${config.title}`}
        className="py-4">
        <EditSectionTitle
          title={config.title}
        >
          {/* add count to title */}
          {relatedSoftware && relatedSoftware.length > 0 ?
            <div className="pl-4 text-2xl">{relatedSoftware.length}</div>
            : null
          }
        </EditSectionTitle>
        <RelatedSoftwareList
          software={relatedSoftware}
          onRemove={onRemove}
        />
      </section>
      <section
        aria-label={config.findTitle}
        className="py-4">
        <EditSectionTitle
          title={config.findTitle}
          subtitle={config.findSubTitle}
        />
        <FindRelatedSoftware
          software={softwareId}
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
