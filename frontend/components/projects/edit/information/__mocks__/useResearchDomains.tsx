// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {ResearchDomain} from '~/types/Project'

export type UseResearchDomainProps = {
  l1Selected: ResearchDomain | null,
  l2Selected: ResearchDomain | null
}

const useResearchDomains=jest.fn(({l1Selected, l2Selected}: UseResearchDomainProps)=>{
  // l1=Level 1 domains are root domains without parent (parent===null)
  const [l1Domains] = useState<ResearchDomain[]>(l1Selected ? [l1Selected] : [])
  // l2=Level 2 domains are domains where parent is selected l1 domain
  const [l2Domains] = useState<ResearchDomain[]>(l2Selected ? [l2Selected] : [])
  // l3=Level 3 domains are domains where parent is selected l2 domain
  const [l3Domains] = useState<ResearchDomain[]>([])

  return {
    l1Domains,
    l2Domains,
    l3Domains
  }
})

export default useResearchDomains
