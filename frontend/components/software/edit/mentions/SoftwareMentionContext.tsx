// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {createContext, useContext, useEffect, useState} from 'react'
import {useSession} from '~/auth/AuthProvider'
import {MentionItemProps} from '~/types/Mention'
import useSoftwareContext from '../context/useSoftwareContext'
import {SoftwareMentionTabKey} from './SoftwareMentionTabs'
import {getSoftwareMention} from './getSoftwareMention'

export type SoftwareMentionCountsProps={
  reference_papers: number,
  citations: number,
  output: number,
}

type SoftwareMentionData={
  reference_papers: MentionItemProps[]
  citations: MentionItemProps[]
  output: MentionItemProps[]
}

type SoftwareMentionContextProps= {
  loading: boolean
  reference_papers: MentionItemProps[]
  citations: MentionItemProps[]
  output: MentionItemProps[]
  counts: SoftwareMentionCountsProps
  setCounts:(cnt:SoftwareMentionCountsProps)=>void
  tab: SoftwareMentionTabKey
  setTab: (tab:SoftwareMentionTabKey)=>void
}

const SoftwareMentionContext = createContext<SoftwareMentionContextProps>({
  loading: true,
  reference_papers:[],
  citations:[],
  output:[],
  counts:{output:0,citations:0, reference_papers: 0},
  setCounts:()=>{},
  tab: 'reference_papers',
  setTab: ()=>{}
})

export function SoftwareMentionProvider(props:any){
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const [loading, setLoading] = useState(true)
  // the tab selected
  const [tab, setTabValue] = useState<SoftwareMentionTabKey>('reference_papers')
  // (mention) data
  const [data, setData] = useState<SoftwareMentionData>({
    reference_papers:[],
    citations:[],
    output:[]
  })
  // counts of items for all tabs
  const [counts, setCounts] = useState({
    reference_papers: 0,
    citations: 0,
    output: 0,
  })

  useEffect(()=>{
    let abort = false
    if (tab && software?.id && token){
      // debugger
      setLoading(true)

      getSoftwareMention(software?.id,token)
        .then(data=>{
          // check for abort
          if (abort === true) return
          // update counts
          setCounts({
            reference_papers: data.reference_papers?.length ?? 0,
            citations: data.citations?.length ?? 0,
            output: data.output?.length ?? 0
          })
          // set data
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
  },[software?.id,token,tab])

  // console.group('SoftwareMentionProvider')
  // console.log('counts...', counts)
  // console.groupEnd()

  function setTab(tab:SoftwareMentionTabKey){
    // show loader
    setLoading(true)
    // set tab value
    setTabValue(tab)
  }

  return (
    <SoftwareMentionContext.Provider
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

export function useSoftwareMentionContext(){
  const {loading,reference_papers,citations,output,counts,setCounts,tab,setTab} = useContext(SoftwareMentionContext)

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
      citations: cnt
    }
    setCounts(newCount)
  }

  function setReferencePapersCnt(cnt:number){
    const newCount = {
      ...counts,
      reference_papers: cnt
    }
    setCounts(newCount)
  }

  return {
    loading,
    reference_papers,
    citations,
    output,
    counts,
    tab,
    setTab,
    setOutputCnt,
    setCitationCnt,
    setReferencePapersCnt
  }
}
