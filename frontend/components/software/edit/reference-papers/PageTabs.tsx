// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import {useSession} from '~/auth'
import useSoftwareContext from '../useSoftwareContext'
import CitationsBySoftware from './CitationsBySoftware'
import ReferencePapersTab from './ReferencePapersTab'
import {useTabCountsContext} from './TabCountsProvider'
import EditReferencePapersProvider from './EditReferencePapersProvider'


function TabContent({tab}:{tab:'reference'|'citation'}){
  switch(tab){
    case 'citation':
      return <CitationsBySoftware />
    default:
      // reference papers is default value
      return <ReferencePapersTab />
  }
}

export default function PageTabs() {
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const [tab, setTab] = useState<'reference'|'citation'>('reference')
  const {referencePaperCnt,citationCnt} = useTabCountsContext()
  return (
    <>
      <Tabs
        value={tab}
        onChange={(_,value)=>setTab(value)}
      >
        <Tab label={`Reference papers (${referencePaperCnt ?? '0'})`} value="reference" />
        <Tab label={`Referenced by (${citationCnt ?? '0'})`} value="citation" />
      </Tabs>
      {/* Reference papers tab provider is shared on both tabs to link to reference paper DOI*/}
      <EditReferencePapersProvider token={token} software={software.id}>
        <TabContent tab={tab} />
      </EditReferencePapersProvider>
    </>
  )
}
