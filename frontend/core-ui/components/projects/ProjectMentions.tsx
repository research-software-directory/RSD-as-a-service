// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {MentionByType, MentionForProject, MentionItemProps, MentionTypeKeys} from '../../types/Mention'
import {clasifyMentionsByType} from '../../utils/editMentions'
import {sortOnDateProp} from '../../utils/sortFn'
import DarkThemeSection from '../layout/DarkThemeSection'
import PageContainer from '../layout/PageContainer'

import MentionItemFeatured from '~/components//mention/MentionItemFeatured'
import MentionViewList from '~/components/mention/MentionViewList'
import {getMentionType} from '../mention/config'

type MentionsSectionProps = {
  output: MentionForProject[]
  impact: MentionForProject[]
}

export default function ProjectMentions({output=[], impact=[]}: MentionsSectionProps) {
  // do not render if no data
  if (output?.length===0 && impact?.length===0) return null
  const {mentionByType:outputByType, featuredMentions: featuredOutput} = clasifyMentionsByType(output)
  const {mentionByType:impactByType, featuredMentions: featuredImpact} = clasifyMentionsByType(impact)

  function renderFeatured(featuredMentions: MentionForProject[]) {
    if (featuredMentions.length === 0) return null
    return featuredMentions
      .sort((a, b) => sortOnDateProp(a, b, 'publication_year', 'desc'))
      .map(item => {
        return (
          <MentionItemFeatured key={item.url} mention={item} />
        )
      })
  }

  function renderImpact(impactByType:MentionByType) {
    if (impact?.length === 0) return null
    // extract mention types from object keys
    const mentionTypes = Object.keys(impactByType)
    return (
      <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
        <h2
          data-testid="project-impact-section-title"
          className="pb-8 text-[2rem] text-white">
          Impact
        </h2>
        <div>
          {renderFeatured(featuredImpact)}
          {/* render impact by type */}
          {mentionTypes.map((key) => {
            const type = key as MentionTypeKeys
            const items = impactByType[type]?.sort((a, b) => {
              // sort mentions on date, newest at the top
              return sortOnDateProp(a,b,'publication_year','desc')
            })
            const title = getMentionType(type,'plural')
              // mentionType[type].plural
            return (
              <MentionViewList
                key={key}
                title={title}
                type={type}
                items={items as MentionItemProps[]}
              />
            )
          })}
        </div>
      </PageContainer>
    )
  }

  function renderOutput(outputByType:MentionByType) {
    if (output?.length === 0) return null
    // extract mention types from object keys
    const mentionTypes = Object.keys(outputByType)
    return (
      <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
        <h2
          data-testid="project-output-section-title"
          className="pb-8 text-[2rem] text-white">
          Output
        </h2>
        <div>
          {renderFeatured(featuredOutput)}
          {/* render output by type */}
          {mentionTypes.map((key) => {
            const type = key as MentionTypeKeys
            const items = outputByType[type]?.sort((a, b) => {
              // sort mentions on date, newest at the top
              return sortOnDateProp(a,b,'publication_year','desc')
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
        </div>
      </PageContainer>
    )
  }

  return (
    <article className="bg-secondary">
      <DarkThemeSection>
        {renderImpact(impactByType)}
        {renderOutput(outputByType)}
      </DarkThemeSection>
    </article>
  )
}
