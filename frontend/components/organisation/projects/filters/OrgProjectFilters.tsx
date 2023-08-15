// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FilterHeader from '~/components/filter/FilterHeader'

import {decodeJsonParam} from '~/utils/extractQueryParam'
import useQueryChange from '../useQueryChange'
import OrgOrderProjectsBy from './OrgOrderProjectsBy'
import OrgProjectKeywordsFilter from './OrgProjectKeywordsFilter'
import useProjectParams from '../useProjectParams'
import useOrgProjectKeywordsList from './useOrgProjectKeywordsList'
import OrgResearchDomainFilter from './OrgResearchDomainFilter'
import useOrgProjectDomainsFilter from './useOrgProjectDomainsList'
import OrgProjectOrganisationsFilter from './OrgProjectOrganisationsFilter'
import useOrgProjectOrganisationList from './useOrgProjectOrganisationsList'
import ProjectStatusFilter from '~/components/projects/overview/filters/ProjectStatusFilter'
import useOrgProjectStatusList from './useOrgProjectStatusList'

export default function OrgProjectFilters() {
  const {resetFilters, handleQueryChange} = useQueryChange()
  const {project_status,filterCnt,keywords_json,domains_json,organisations_json} = useProjectParams()
  const {keywordsList} = useOrgProjectKeywordsList()
  const {domainsList} = useOrgProjectDomainsFilter()
  const {organisationList} = useOrgProjectOrganisationList()
  const {statusList} = useOrgProjectStatusList()

  const keywords = decodeJsonParam(keywords_json, [])
  const domains = decodeJsonParam(domains_json, [])
  const organisations= decodeJsonParam(organisations_json,[])

  // debugger
  function clearDisabled() {
    if (filterCnt && filterCnt > 0) return false
    // if (order) return false
    return true
  }

  return (
    <>
      <FilterHeader
        filterCnt={filterCnt}
        disableClear={clearDisabled()}
        resetFilters={()=>resetFilters('projects')}
      />
      {/* Order by */}
      <OrgOrderProjectsBy />
      {/* Project status */}
      <ProjectStatusFilter
        status={project_status ?? ''}
        statusList={statusList}
        handleQueryChange={handleQueryChange}
      />
      {/* Keywords */}
      <OrgProjectKeywordsFilter
        keywords={keywords}
        keywordsList={keywordsList}
      />
      {/* Research domains */}
      <OrgResearchDomainFilter
        domains={domains}
        domainsList={domainsList}
      />
      {/* Participating organisations */}
      <OrgProjectOrganisationsFilter
        organisations={organisations}
        organisationsList={organisationList}
      />
    </>
  )
}
