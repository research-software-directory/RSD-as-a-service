// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useContext, useState} from 'react'

export type MentionCountsProps={
  output: number
  citation: number
  impact: number
}

type MentionContextProps= {
  counts: MentionCountsProps
  setCounts:(cnt:MentionCountsProps)=>void
}

const MentionCountsContext = createContext<MentionContextProps>({
  counts:{output:0,citation:0,impact:0},
  setCounts:()=>{}
})

export function MentionCountsProvider(props:any){

  const [counts, setCounts] = useState(props?.counts ?? {
    output:0,
    citation:0,
    impact:0
  })

  // console.group('MentionCountProvider')
  // console.log('counts...', counts)
  // console.groupEnd()

  return (
    <MentionCountsContext.Provider
      value={{
        counts,
        setCounts
      }}
      {...props}
    />
  )
}

export function useMentionCounts(){
  const {counts,setCounts} = useContext(MentionCountsContext)

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
    counts,
    setOutputCnt,
    setCitationCnt,
    setImpactCnt
  }
}
