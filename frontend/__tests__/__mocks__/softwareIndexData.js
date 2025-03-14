// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import softwareItem from './softwareItem.json'
import SoftwareCitationItems from './citationItems'
import licenseInfo from '~/components/software/edit/links/__mocks__/licenseForSoftware.json'
import apiMentions from './apiMentions.json'
import apiTestimonial from './apiTestiomonial.json'
import apiContributors from './apiContributors.json'
import apiRelatedSoftware from './apiRelatedSoftware.json'
// similar to project (only one prop difference)
import apiRelatedProjects from './apiRelatedProjects.json'
import apiKeywordsBySoftware from './apiKeywordsBySoftware.json'
import apiOrganisationsOfSoftware from './apiOrganisationsOfSoftware.json'


const repoInfo = {
  'software': '8560c4d0-08b1-4844-9df4-18dd70847e9e',
  // NOTE! investigate why test brakes when using d3 lib
  // 'url': 'https://github.com/dianna-ai/dianna',
  'code_platform': 'github',
  'languages': {'Jupyter Notebook':527226,'Python':106639,'TeX':20572,'Shell':1007},
  'languages_scraped_at': '2022-05-14T12:36:02.249679',
  'license': 'Apache-2.0',
  'star_count': 123,
  'fork_count': 42,
  'open_issue_count': 67,
  'basic_data_scraped_at': '2022-05-14T11:32:02.215724',
  // 'commit_history': {'1625356800':1,'1625961600':4,'1626566400':1,'1627171200':0,'1627776000':0,'1628380800':0,'1628985600':7,'1629590400':5,'1630195200':9,'1630800000':0,'1631404800':5,'1632009600':15,'1632614400':3,'1633219200':25,'1633824000':10,'1634428800':20,'1635033600':1,'1635638400':0,'1636243200':0,'1636848000':6,'1637452800':1,'1638057600':0,'1638662400':2,'1639267200':16,'1639872000':21,'1640476800':0,'1641081600':13,'1641686400':37,'1642291200':51,'1642896000':64,'1643500800':53,'1644105600':45,'1644710400':10,'1645315200':7,'1645920000':7,'1646524800':7,'1647129600':22,'1647734400':17,'1648339200':3,'1648944000':7,'1649548800':3,'1650153600':2,'1650758400':0,'1651363200':1,'1651968000':0},
  'commit_history_scraped_at': '2022-05-14T12:46:02.082697'
}

const softwarePageData = {
  slug: 'test-slug',
  software: softwareItem,
  citationInfo: SoftwareCitationItems,
  keywords: apiKeywordsBySoftware,
  categories: [],
  licenseInfo,
  repositoryInfo: repoInfo,
  mentions: apiMentions,
  testimonials: apiTestimonial,
  contributors: apiContributors,
  relatedTools: apiRelatedSoftware,
  relatedProjects: apiRelatedProjects,
  isMaintainer: false,
  organisations: apiOrganisationsOfSoftware,
  categories:[],
  orgMaintainer:[],
  comMaintainer:[]
}

export default softwarePageData
