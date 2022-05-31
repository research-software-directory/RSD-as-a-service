import {useEffect} from 'react'

import {sortOnDateProp} from '~/utils/sortFn'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import {MentionItemProps} from '~/types/Mention'
import {getMentionsForSoftware} from '~/utils/editMentions'

type MentionForSoftwareProps = {
  software: string,
  token:string
}

export default function useMentionForSoftware({software, token}: MentionForSoftwareProps) {
  const {mentions, setMentions, loading, setLoading} = useEditMentionReducer()

  useEffect(() => {
    let abort = false
    async function getImpactFromApi() {
      setLoading(true)
      // TODO! this request is made two times, investigate
      const mentionsForProject = await getMentionsForSoftware({
        software,
        token,
        frontend: true
      })
      if (mentionsForProject && abort === false) {
        const mentions:MentionItemProps[] = mentionsForProject.map(item => {
          // remove prop we do not need
          // PATCH request fails when additional props send
          delete item.mention_for_software
          return item
        }).sort((a, b) => {
          // sort mentions on publication year, newest at the top
          return sortOnDateProp(a,b,'publication_year','desc')
        })
        // debugger
        setMentions(mentions)
        setLoading(false)
      }
    }
    if (software && token) {
      getImpactFromApi()
    }
    return () => { abort = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[software,token])

  // console.group('useMentionForSoftware')
  // console.log('loading...', loading)
  // console.log('impactCnt...', mentions.length)
  // console.groupEnd()

  return {
    loading,
    mentionCnt: mentions.length,
  }
}
