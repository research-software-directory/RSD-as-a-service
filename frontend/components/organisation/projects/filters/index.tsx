// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import FilterHeader from '~/components/filter/FilterHeader'

import {decodeJsonParam} from '~/utils/extractQueryParam'
import KeywordsFilter from '~/components/filter/KeywordsFilter'
import ResearchDomainFilter from '~/components/filter/ResearchDomainFilter'
import OrganisationsFilter from '~/components/filter/OrganisationsFilter'
import CategoriesFilter from '~/components/filter/CategoriesFilter'
import ProjectStatusFilter from '~/components/projects/overview/filters/ProjectStatusFilter'
import useProjectParams from '~/components/projects/overview/useProjectParams'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import OrgOrderProjectsBy from './OrgOrderProjectsBy'
import useOrgProjectKeywordsList from './useOrgProjectKeywordsList'
import useOrgProjectDomainsFilter from './useOrgProjectDomainsList'
import useOrgProjectOrganisationList from './useOrgProjectOrganisationsList'
import useOrgProjectStatusList from './useOrgProjectStatusList'
import useOrgProjectCategoriesList from './useOrgProjectCategoriesList'

export default function OrgProjectFilters() {
  const {resetFilters, handleQueryChange} = useQueryChange()
  const {project_status,filterCnt,keywords_json,domains_json,organisations_json,categories_json} = useProjectParams()
  const {keywordsList} = useOrgProjectKeywordsList()
  const {domainsList} = useOrgProjectDomainsFilter()
  const {organisationList} = useOrgProjectOrganisationList()
  const {statusList} = useOrgProjectStatusList()
  const {hasCategories, categoryList} = useOrgProjectCategoriesList()

  const keywords = decodeJsonParam(keywords_json, [])
  const domains = decodeJsonParam(domains_json, [])
  const organisations = decodeJsonParam(organisations_json,[])
  const categories = decodeJsonParam(categories_json,[])

  // console.group('OrgProjectFilters')
  // console.log('hasCategories...', hasCategories)
  // console.log('categoryList...', categoryList)
  // console.groupEnd()

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
      {/* Custom organisation categories */}
      {hasCategories ?
        <div>
          <CategoriesFilter
            title="Categories"
            categories={categories}
            categoryList={categoryList}
            handleQueryChange={handleQueryChange}
          />
        </div>
        : null
      }
    </>
  )
}
