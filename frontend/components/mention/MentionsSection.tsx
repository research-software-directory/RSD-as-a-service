// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {sortOnNumProp} from '~/utils/sortFn'
import {MentionItemProps} from '~/types/Mention'
import {classifyMentionsByType} from '~/components/mention/apiEditMentions'
import {getMentionType, getMentionTypeOrder} from '~/components/mention/config'
import PageContainer from '~/components/layout/PageContainer'
import MentionItemFeatured from '~/components/mention/MentionItemFeatured'
import MentionViewList from '~/components/mention/MentionViewList'

type MentionsSectionProps = {
  title: string
  mentions: MentionItemProps[]
}

export default function MentionsSection({title, mentions}: MentionsSectionProps) {
  // do not render section if no data
  if (!mentions || mentions.length === 0) return null
  // split to featured and (not featured) mentions by type (different presentation)
  const {mentionByType, featuredMentions} = classifyMentionsByType(mentions)
  const mentionTypes = getMentionTypeOrder(mentionByType)
  // console.group('MentionsSection')
  // console.log('mentionByType...', mentionByType)
  // console.log('featuredMentions...', featuredMentions)
  // console.groupEnd()
  return (
    <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr_4fr] lg:gap-4">
      <h2
        data-testid="software-mentions-section-title"
        className="pb-8 text-[2rem] text-base-100">
        {title}
      </h2>
      <section>
        {featuredMentions
          .sort((a,b)=>sortOnNumProp(a,b,'publication_year','desc'))
          .map(item => {
            return (
              <MentionItemFeatured key={item.url} mention={item} />
            )
          })}
        {/* render output by type */}
        {mentionTypes.map((key) => {
          const items = mentionByType[key]?.sort((a, b) => {
            // sort mentions on date, newest at the top
            return sortOnNumProp(a,b,'publication_year','desc')
          })
          if (items){
            const title = getMentionType(key,'plural')
            return (
              <MentionViewList
                key={key}
                title={title}
                items={items}
              />
            )
          }
        })}
      </section>
    </PageContainer>
  )
}
