// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useContext, useEffect, useState} from 'react'
import {useSession} from '~/auth/AuthProvider'
import {MentionItemProps} from '~/types/Mention'
import useProjectContext from '../context/useProjectContext'
import {ProjectMentionTabKey} from './ProjectMentionTabs'
import {getProjectMention} from './getProjectMention'

export type ProjectMentionCountsProps={
  output: number
  citation: number
  impact: number
}

type ProjectMentionData={
  output: MentionItemProps[]
  citation: MentionItemProps[]
  impact: MentionItemProps[]
}

type ProjectMentionContextProps= {
  loading: boolean
  output: MentionItemProps[]
  citation: MentionItemProps[]
  impact: MentionItemProps[]
  counts: ProjectMentionCountsProps
  setCounts:(cnt:ProjectMentionCountsProps)=>void
  tab: ProjectMentionTabKey
  setTab: (tab:ProjectMentionTabKey)=>void
}

const ProjectMentionContext = createContext<ProjectMentionContextProps>({
  loading:true,
  output:[],
  citation:[],
  impact:[],
  counts:{output:0,citation:0,impact:0},
  setCounts:()=>{},
  tab: 'output',
  setTab:()=>{}
})

export function ProjectMentionProvider(props:any){
  const {token} = useSession()
  const {project} = useProjectContext()
  const [loading, setLoading] = useState(true)
  const [tab, setTabValue] = useState<ProjectMentionTabKey>('output')
  // (mention) data
  const [data, setData] = useState<ProjectMentionData>({
    output:[],
    citation:[],
    impact:[]
  })
  // counts
  const [counts, setCounts] = useState({
    output:0,
    citation:0,
    impact:0
  })

  // console.group('ProjectMentionProvider')
  // console.log('counts...', counts)
  // console.groupEnd()

  useEffect(()=>{
    let abort = false
    if (tab && project?.id && token){
      // debugger
      // setLoading(true)

      getProjectMention(project.id,token)
        .then(data=>{
          // check for abort
          if (abort === true) return
          // update counts
          setCounts({
            output: data.output?.length ?? 0,
            citation: data.citation?.length ?? 0,
            impact: data.impact?.length ?? 0
          })
          // update items
          setData(data)
        })
        .finally(()=>{
          if (abort === true) return
          // delay hiding loader
          setTimeout(()=>{
            setLoading(false)
          },300)
        })
    }
    return ()=>{abort=true}
  },[project?.id,token,tab])


  function setTab(tab:ProjectMentionTabKey){
    // show loader
    setLoading(true)
    // set tab value
    setTabValue(tab)
  }

  return (
    <ProjectMentionContext.Provider
      value={{
        ...data,
        counts,
        setCounts,
        tab,
        setTab,
        loading
      }}
      {...props}
    />
  )
}

export function useProjectMentionContext(){
  const {loading,output,citation,impact,counts,setCounts,tab,setTab} = useContext(ProjectMentionContext)

  function setOutputCnt(cnt:number){
    const newCount = {
      ...counts,
      output: cnt
    }
    setCounts(newCount)
  }

  function setCitationCnt(cnt:number){
    const newCount = {
      ...counts,
      citation: cnt
    }
    setCounts(newCount)
  }

  function setImpactCnt(cnt:number){
    const newCount = {
      ...counts,
      impact: cnt
    }
    setCounts(newCount)
  }

  return {
    loading,
    output,
    citation,
    impact,
    counts,
    tab,
    setTab,
    setOutputCnt,
    setCitationCnt,
    setImpactCnt
  }
}
