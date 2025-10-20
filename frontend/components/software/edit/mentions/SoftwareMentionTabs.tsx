// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import ReferenceTab from '~/components/software/edit/mentions/reference-papers/index'
import CitationTab from '~/components/software/edit/mentions/citations/index'
import OutputTab from '~/components/software/edit/mentions/output/index'
import {useSoftwareMentionContext} from './SoftwareMentionContext'

export type SoftwareMentionTabKey = 'reference_papers' | 'citations' | 'output'

type TabProps={
  key: SoftwareMentionTabKey,
  label: (cnt:number)=>string
}

const tabs:TabProps[]=[
  {key:'reference_papers', label:(cnt:number)=>`Reference papers (${cnt ?? 0})`},
  {key:'citations', label:(cnt:number)=>`Citations (${cnt ?? 0})`},
  {key:'output', label:(cnt:number)=>`Related output (${cnt ?? 0})`},
]

export function SoftwareMentionContent({tab}:{tab:Readonly<SoftwareMentionTabKey>}){
  switch(tab){
    case 'output':
      return <OutputTab />
    case 'reference_papers':
      return <ReferenceTab />
    case 'citations':
      return <CitationTab/>
    default:
      return <ReferenceTab />
  }
}

export default function SoftwareMentionTabs(){
  const {counts, tab, setTab} = useSoftwareMentionContext()

  // console.group('SoftwareMentionTabs')
  // console.log('tab...', tab)
  // console.log('counts...', counts)
  // console.groupEnd()

  return (
    <section>
      <Tabs
        value={tab}
        onChange={(_,value)=>setTab(value)}
        sx={{
          marginTop:'0.5rem',
        }}
      >
        {tabs.map(tab=>{
          return (
            <Tab key={tab.key} label={tab.label(counts[tab.key])} value={tab.key} sx={{color:'text.primary'}} />
          )
        })}
      </Tabs>
      <SoftwareMentionContent tab={tab} />
    </section>
  )
}
