// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Dispatch, SetStateAction, createContext, useContext, useState} from 'react'

type TabCounts={
  referencePaperCnt: number | null,
  citationCnt: number | null,
  setReferencePaperCnt: Dispatch<SetStateAction<number|null>>,
  setCitationCnt: Dispatch<SetStateAction<number|null>>,
}

const TabCountContext = createContext<TabCounts|null>(null)

export function TabCountsProvider(props:any){
  const [referencePaperCnt, setReferencePaperCnt] = useState(null)
  const [citationCnt, setCitationCnt] = useState(null)

  return (
    <TabCountContext.Provider value={{
      referencePaperCnt,
      citationCnt,
      setReferencePaperCnt,
      setCitationCnt
    }}
    {...props}
    />
  )
}

export function useTabCountsContext(){
  const context = useContext(TabCountContext)
  if (context===null){
    throw new Error('useTabCountsContext must be used within TabCountProvider')
  }
  return context
}

export function useReferencePaperCnt(){
  const {referencePaperCnt,setReferencePaperCnt} = useTabCountsContext()
  return {
    referencePaperCnt,
    setReferencePaperCnt
  }
}

export function useCitationCnt(){
  const {citationCnt,setCitationCnt} = useTabCountsContext()
  return {
    citationCnt,
    setCitationCnt
  }
}
