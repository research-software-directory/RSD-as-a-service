// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FilterHeader from '~/components/layout/filter/FilterHeader'

import useProjectOverviewParams from '../useProjectOverviewParams'
import ProjectKeywordsFilter, {KeywordFilterOption} from './ProjectKeywordsFilter'
import ResearchDomainFilter, {ResearchDomainOption} from './ResearchDomainFilter'
import OrderProjectsBy from './OrderProjectsBy'
import OrganisationFilter, {OrganisationOption} from './OrganisationFilter'


type ProjectFiltersProps = {
  orderBy: string
  keywords: string[]
  keywordsList: KeywordFilterOption[]
  domains: string[],
  domainsList: ResearchDomainOption[]
  organisations: string[]
  organisationsList: OrganisationOption[]
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
  filterCnt
}: ProjectFiltersProps) {

  const {resetFilters} = useProjectOverviewParams()

  function clearDisabled() {
    if (filterCnt && filterCnt > 0) return false
    if (orderBy) return false
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
      {/* Keywords */}
      <ProjectKeywordsFilter
        keywords={keywords}
        keywordsList={keywordsList}
      />
      {/* Research domains */}
      <ResearchDomainFilter
        domains={domains}
        domainsList={domainsList}
      />
      {/* Research domains */}
      <OrganisationFilter
        organisations={organisations}
        organisationsList={organisationsList}
      />
    </>
  )
}
