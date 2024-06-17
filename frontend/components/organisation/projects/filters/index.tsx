// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FilterHeader from '~/components/filter/FilterHeader'

import {decodeJsonParam} from '~/utils/extractQueryParam'
import KeywordsFilter from '~/components/filter/KeywordsFilter'
import ResearchDomainFilter from '~/components/filter/ResearchDomainFilter'
import OrganisationsFilter from '~/components/filter/OrganisationsFilter'
import ProjectStatusFilter from '~/components/projects/overview/filters/ProjectStatusFilter'
import useQueryChange from '../useQueryChange'
import useProjectParams from '../useProjectParams'
import OrgOrderProjectsBy from './OrgOrderProjectsBy'
import useOrgProjectKeywordsList from './useOrgProjectKeywordsList'
import useOrgProjectDomainsFilter from './useOrgProjectDomainsList'
import useOrgProjectOrganisationList from './useOrgProjectOrganisationsList'
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
      <div>
        <KeywordsFilter
          keywords={keywords}
          keywordsList={keywordsList}
          handleQueryChange={handleQueryChange}
        />
      </div>
      {/* Research domains */}
      <div>
        <ResearchDomainFilter
          domains={domains}
          domainsList={domainsList}
          handleQueryChange={handleQueryChange}
        />
      </div>
      {/* Participating organisations */}
      <div>
        <OrganisationsFilter
          organisations={organisations}
          organisationsList={organisationList}
          handleQueryChange={handleQueryChange}
        />
      </div>
    </>
  )
}
