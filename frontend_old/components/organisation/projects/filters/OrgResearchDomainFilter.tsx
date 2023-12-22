// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ResearchDomainFilter, {ResearchDomainOption} from '~/components/filter/ResearchDomainFilter'
import useQueryChange from '../useQueryChange'

type ResearchDomainFilterProps = {
  domains: string[],
  domainsList: ResearchDomainOption[]
}

export default function OrgResearchDomainFilter({domains, domainsList}: ResearchDomainFilterProps) {
  const {handleQueryChange} = useQueryChange()

  // console.group('OrgResearchDomainFilter')
  // console.log('domainsList...', domainsList)
  // console.log('options...', options)
  // console.groupEnd()

  return (
    <div>
      <ResearchDomainFilter
        domains={domains}
        domainsList={domainsList}
        handleQueryChange={handleQueryChange}
      />
    </div>
  )

}
