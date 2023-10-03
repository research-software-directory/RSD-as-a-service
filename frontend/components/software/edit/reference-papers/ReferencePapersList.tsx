// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import useSoftwareContext from '../useSoftwareContext'
import ReferencePaper from './ReferencePaper'
import {useCitationCnt, useReferencePaperCnt} from './TabCountsProvider'
import {getCitationCountForSoftware, getReferencePapersForSoftware} from './apiReferencePapers'
import NoReferencePapers from './NoRefferencePapers'

export default function ReferencePapersList() {
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const {mentions, setMentions, loading, setLoading, onDelete} = useEditMentionReducer()
  const {setReferencePaperCnt} = useReferencePaperCnt()
  const {setCitationCnt} = useCitationCnt()

  // console.group('ReferencePapersList')
  // console.log('mentions...', mentions)
  // console.log('loading...', loading)
  // console.groupEnd()
  // debugger

  useEffect(()=>{
    let abort = false
    if (software.id && token){
      getCitationCountForSoftware(software.id,token)
        .then(count=> {
          setCitationCnt(count)
        })
    }
    return () => { abort = true }
  },[software.id,token,setCitationCnt])

  useEffect(() => {
    let abort = false
    async function getReferencePapersFromApi() {
      setLoading(true)
      const referencePapers = await getReferencePapersForSoftware({
        software: software.id,
        token
      })
      if (referencePapers && abort === false) {
        // debugger
        setMentions(referencePapers)
        setLoading(false)
      }
    }
    if (software?.id && token) {
      getReferencePapersFromApi()
    }
    return () => { abort = true }
  },[software.id,token,setLoading,setMentions])


  if (loading) {
    return (
      <div className="h-full flex items-center">
        <ContentLoader />
      </div>
    )
  }

  setReferencePaperCnt(mentions.length)

  if (mentions.length === 0){
    return <NoReferencePapers />
  }

  return (
    <>
      {mentions.map(item=>{
        return (
          <ReferencePaper
            key={item.id}
            item={item}
            onDelete={()=>{
              onDelete(item)
            }}
          />
        )
      })}
    </>
  )
}
