
import softwareItem from './softwareItem.json'
import SoftwareCitationItems from './citationItems'
import contributorMentionCount from './contributorMentionCnt'

const repoInfo = {
  software: softwareItem.id,
  url: 'test-url',
  languages: null,
  license: 'test license',
  commit_history: null
}


const softwarePageData = {
  slug: 'test-slug',
  software: softwareItem,
  citationInfo: SoftwareCitationItems,
  tagsInfo: [],
  licenseInfo: [],
  repositoryInfo: repoInfo,
  softwareIntroCounts: contributorMentionCount,
  mentions: [],
  testimonials: [],
  contributors: [],
  relatedTools: [],
  isMaintainer: false
}

export default softwarePageData
