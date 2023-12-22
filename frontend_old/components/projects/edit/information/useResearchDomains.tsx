// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {ResearchDomain} from '~/types/Project'
import logger from '~/utils/logger'

type Domain = {
  root: ResearchDomain[]
  children: ResearchDomain[]
}

export type UseResearchDomainProps = {
  l1Selected: ResearchDomain | null,
  l2Selected: ResearchDomain | null
}

function categoriseDomains(researchDomains: ResearchDomain[]) {
  // build the structure
  const oDomains: Domain = {
    root: [],
    children:[]
  }
  if (researchDomains) {
    // construct root/children structure
    researchDomains?.forEach(item => {
      // create new root domain object
      if (item.parent === null) {
        // add new root domain
        oDomains.root.push(item)
      } else {
        // add new child domain (l2 or l3)
        oDomains.children.push(item)
      }
    })
  }
  return oDomains
}

export default function useResearchDomains({l1Selected, l2Selected}: UseResearchDomainProps) {
  // categorised domains to root/children
  const [domains, setDomains] = useState<Domain>()
  // l1=Level 1 domains are root domains without parent (parent===null)
  const [l1Domains, setL1Domains] = useState<ResearchDomain[]>([])
  // l2=Level 2 domains are domains where parent is selected l1 domain
  const [l2Domains, setL2Domains] = useState<ResearchDomain[]>([])
  // l3=Level 3 domains are domains where parent is selected l2 domain
  const [l3Domains, setL3Domains] = useState<ResearchDomain[]>([])

  useEffect(() => {
    let abort = false

    async function getResearchDomains() {
      const resp = await fetch('/api/v1/research_domain?order=key.asc')
      if (resp.status === 200) {
        const json = await resp.json()
        if (abort) return
        // split domains to root/children
        const domains = categoriseDomains(json)
        // save to local state
        setDomains(domains)
      } else {
        logger(`useResearchDomainOptions.getResearchDomains: ${resp.status}: ${resp.statusText}`, 'warn')
        if (abort) return
        // save as empty on error
        setDomains({
          root: [],
          children: []
        })
      }
    }

    if (abort === false) {
      getResearchDomains()
    }
    return ()=>{abort=true}
  },[])

  useEffect(() => {
    if (domains && domains.root) {
      // set root domains
      setL1Domains(domains.root)
    }
  },[domains])

  useEffect(() => {
    if (l1Selected && domains &&
      domains.children) {
      // filter out l2 domains for l1Selected parent
      const l2domains = domains.children.filter(item => {
        return item.parent === l1Selected.id
      })
      setL2Domains(l2domains)
    }
  }, [l1Selected, domains])

  useEffect(() => {
    if (l2Selected && domains &&
      domains.children) {
      // filter out l3 domains for l2Selected parent
      const l3domains = domains.children.filter(item => {
        return item.parent === l2Selected.id
      })
      setL3Domains(l3domains)
    }
  },[l2Selected,domains])

  return {
    l1Domains,
    l2Domains,
    l3Domains
  }
}
