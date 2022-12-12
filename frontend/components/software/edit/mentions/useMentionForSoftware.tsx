// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import {getMentionsForSoftware} from '~/utils/editMentions'

type MentionForSoftwareProps = {
  software: string,
  token:string
}

export default function useMentionForSoftware({software, token}: MentionForSoftwareProps) {
  const {mentions, setMentions, loading, setLoading} = useEditMentionReducer()
  const [loadedSoftware, setLoadedSoftware] = useState<string>('')

  useEffect(() => {
    let abort = false
    async function getImpactFromApi() {
      setLoading(true)
      // TODO! this request is made two times, investigate
      const mentionsForSoftware = await getMentionsForSoftware({
        software,
        token,
        frontend: true
      })
      if (mentionsForSoftware && abort === false) {
        // debugger
        setMentions(mentionsForSoftware)
        setLoadedSoftware(software)
        setLoading(false)
      }
    }
    if (software && token &&
      software !== loadedSoftware) {
      getImpactFromApi()
    }

    return () => { abort = true }
    // we skip setMentions and setLoading methods in the deps to avoid loop
    // TODO! try wrapping methods of useEditMentionReducer in useCallback?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[software,token,loadedSoftware])

  // console.group('useMentionForSoftware')
  // console.log('loading...', loading)
  // console.log('impactCnt...', mentions.length)
  // console.groupEnd()

  return {
    loading,
    mentionCnt: mentions.length,
  }
}
