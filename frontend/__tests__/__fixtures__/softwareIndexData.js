
import softwareItem from './softwareItem.json'
import SoftwareCitationItems from './citationItems'
import contributorMentionCount from './contributorMentionCnt'
import licenseInfo from './licenseForSoftware.json'
import apiMentions from './apiMentions.json'
import apiTestimonial from './apiTestiomonial.json'
import apiContributors from './apiContributors.json'
import apiRelatedSoftware from './apiRelatedSoftware.json'

const repoInfo = {
  software: softwareItem.id,
  url: 'test-url',
  languages: null,
  license: 'test license',
  commit_history: null
}

const tagsInfo = [
  {
      'software': 'e1a3cb3a-0c9d-4eec-b327-d36166b4f464',
      'tag': 'Big data'
  },
  {
      'software': 'e1a3cb3a-0c9d-4eec-b327-d36166b4f464',
      'tag': 'High performance computing'
  },
  {
      'software': 'e1a3cb3a-0c9d-4eec-b327-d36166b4f464',
      'tag': 'Optimized data handling'
  }
]


const softwarePageData = {
  slug: 'test-slug',
  software: softwareItem,
  citationInfo: SoftwareCitationItems,
  tagsInfo,
  licenseInfo,
  repositoryInfo: repoInfo,
  softwareIntroCounts: contributorMentionCount,
  mentions: apiMentions,
  testimonials: apiTestimonial,
  contributors: apiContributors,
  relatedTools: apiRelatedSoftware,
  isMaintainer: false
}

export default softwarePageData
