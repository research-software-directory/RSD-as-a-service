// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import OutputTab from '~/components/projects/edit/mentions/output/index'
import CitationTab from '~/components/projects/edit/mentions/citations/index'
import ImpactTab from '~/components/projects/edit/mentions/impact/index'
import {useProjectMentionContext} from './ProjectMentionContext'

export type ProjectMentionTabKey = 'output' | 'citation' | 'impact'

type TabProps={
  key: ProjectMentionTabKey,
  label: (cnt:number)=>string
}

const tabs:TabProps[]=[
  {key:'output', label:(cnt:number)=>`Output (${cnt ?? 0})`},
  {key:'citation', label:(cnt:number)=>`Citations (${cnt ?? 0})`},
  {key:'impact', label:(cnt:number)=>`Impact (${cnt ?? 0})`},
]

function TabContent({tab}:{tab:Readonly<ProjectMentionTabKey>}){
  switch(tab){
    case 'output':
      return <OutputTab />
    case 'impact':
      return <ImpactTab />
    case 'citation':
      return <CitationTab/>
    default:
      return <OutputTab />
  }
}

export default function ProjectMentionTabs(){
  const {counts,tab,setTab} = useProjectMentionContext()

  // console.group('ProjectMentionTabs')
  // console.log('tab...', tab)
  // console.log('counts...', counts)
  // console.groupEnd()

  return (
    <>
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
      <TabContent tab={tab} />
    </>
  )
}
