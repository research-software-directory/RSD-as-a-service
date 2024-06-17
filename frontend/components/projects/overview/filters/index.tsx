// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FilterHeader from '~/components/filter/FilterHeader'

import KeywordsFilter, {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import OrganisationsFilter, {OrganisationOption} from '~/components/filter/OrganisationsFilter'
import ResearchDomainFilter, {ResearchDomainOption} from '~/components/filter/ResearchDomainFilter'
import useProjectOverviewParams from '../useProjectOverviewParams'
import OrderProjectsBy from './OrderProjectsBy'
import ProjectStatusFilter, {StatusFilterOption} from './ProjectStatusFilter'

type ProjectFiltersProps = {
  orderBy: string
  keywords: string[]
  keywordsList: KeywordFilterOption[]
  domains: string[],
  domainsList: ResearchDomainOption[]
  organisations: string[]
  organisationsList: OrganisationOption[]
  status: string
  statusList: StatusFilterOption[]
  filterCnt: number,
}


export default function ProjectFilters({
  orderBy,
  keywords,
  keywordsList,
  domains,
  domainsList,
  organisations,
  organisationsList,
  status,
  statusList,
  filterCnt
}: ProjectFiltersProps) {

  const {resetFilters,handleQueryChange} = useProjectOverviewParams()

  function clearDisabled() {
    if (filterCnt && filterCnt > 0) return false
    return true
  }

  return (
    <>
      <FilterHeader
        filterCnt={filterCnt}
        disableClear={clearDisabled()}
        resetFilters={resetFilters}
      />
      {/* Order by */}
      <OrderProjectsBy
        orderBy={orderBy}
      />
      {/* Project status */}
      <ProjectStatusFilter
        status={status}
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
          organisationsList={organisationsList}
          handleQueryChange={handleQueryChange}
        />
      </div>
    </>
  )
}
