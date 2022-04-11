
import {MentionForProject} from '../../types/Mention'
import {clasifyMentionsByType} from '../../utils/editMentions'
import {sortOnDateProp} from '../../utils/sortFn'
import DarkThemeSection from '../layout/DarkThemeSection'
import PageContainer from '../layout/PageContainer'
import MentionIsFeatured from '../software/MentionIsFeatured'
import MentionsByType, {MentionByType} from '../software/MentionsByType'

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
      .sort((a, b) => sortOnDateProp(a, b, 'date', 'desc'))
      .map(item => {
        return (
          <MentionIsFeatured key={item.url} mention={item} />
        )
      })
  }

  function renderImpact(impactByType:MentionByType) {
    if (impact?.length===0) return null
    return (
      <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
        <h2
          data-testid="project-impact-section-title"
          className="pb-8 text-[2rem] text-white">
          Impact
        </h2>
        <div>
          {renderFeatured(featuredImpact)}
          <MentionsByType mentionByType={impactByType} />
        </div>
      </PageContainer>
    )
  }

  function renderOutput(outputByType:MentionByType) {
    if (output?.length===0) return null
    return (
      <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
        <h2
          data-testid="project-output-section-title"
          className="pb-8 text-[2rem] text-white">
          Output
        </h2>
        <div>
          {renderFeatured(featuredOutput)}
          <MentionsByType mentionByType={outputByType} />
        </div>
      </PageContainer>
    )
  }

  return (
    <DarkThemeSection>
      {renderImpact(impactByType)}
      {renderOutput(outputByType)}
    </DarkThemeSection>
  )
}
