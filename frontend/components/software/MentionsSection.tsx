// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import DarkThemeSection from '../layout/DarkThemeSection'
import PageContainer from '../layout/PageContainer'
import {sortOnNumProp} from '../../utils/sortFn'
import {MentionForSoftware, MentionItemProps, MentionTypeKeys} from '../../types/Mention'
import {clasifyMentionsByType} from '../../utils/editMentions'
import MentionItemFeatured from '../mention/MentionItemFeatured'
import {getMentionType, getMentionTypeOrder} from '../mention/config'
import MentionViewList from '../mention/MentionViewList'

export default function SoftwareMentionsSection({mentions}: { mentions: MentionForSoftware[] }) {
  // do not render section if no data
  if (!mentions || mentions.length === 0) return null
  // split to featured and (not featured) mentions by type (different presentation)
  const {mentionByType, featuredMentions} = clasifyMentionsByType(mentions)
  const mentionTypes = getMentionTypeOrder(mentionByType)
  // console.group('SoftwareMentionsSection')
  // console.log('mentionByType...', mentionByType)
  // console.log('featuredMentions...', featuredMentions)
  // console.groupEnd()
  return (
    <article className="bg-secondary">
      <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
        <DarkThemeSection>
        <h2
          data-testid="software-mentions-section-title"
          className="pb-8 text-[2rem] text-white">
          Mentions
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
            const type = key as MentionTypeKeys
            const items = mentionByType[type]?.sort((a, b) => {
              // sort mentions on date, newest at the top
              return sortOnNumProp(a,b,'publication_year','desc')
            })
            const title = getMentionType(type,'plural')
            return (
              <MentionViewList
                key={key}
                title={title}
                type={type}
                items={items as MentionItemProps[]}
              />
            )
          })}
          </section>
          </DarkThemeSection>
        </PageContainer>
    </article>
  )
}
