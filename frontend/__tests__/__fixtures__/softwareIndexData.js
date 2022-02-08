
import softwareItem from './softwareItem.json'
import SoftwareCitationItems from './citationItems'
import contributorMentionCount from './contributorMentionCnt'

const softwarePageData = {
  slug: 'test-slug',
  software: softwareItem,
  citationInfo: SoftwareCitationItems,
  tagsInfo: [],
  licenseInfo: [],
  softwareIntroCounts: contributorMentionCount,
  mentions: [],
  testimonials: [],
  contributors: [],
  relatedTools: [],
  isMaintainer: false
}

export default softwarePageData
