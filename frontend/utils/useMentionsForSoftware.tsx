import {useEffect, useState} from 'react'
import {MentionForSoftware} from '../types/MentionType'

import {getMentionsForSoftware} from './editMentions'

/**
 * Mentions for software hook.
 * NOTE! the reload is used to trigger additional request to api by toggeling the value.
 */
export default function useMentionsForSoftware({software,token,reload=false}:
  {software: string | undefined, token: string, reload:boolean}) {
  const [mentions, setMentions] = useState<MentionForSoftware[]>([])
  const [loading, setLoading]=useState(true)

  useEffect(() => {
    let abort = false
    async function getMentions(software:string,token:string) {
      setLoading(true)
      const mentions = await getMentionsForSoftware({
        software,
        token,
        frontend:true
      })
      // stop op abort
      if (abort===true) return null
      setMentions(mentions ?? [])
      setLoading(false)
    }
    if (typeof software != 'undefined' && token) {
      getMentions(software,token)
    }
    return ()=>{abort=true}
  }, [software, token, reload])

  return {
    loading,
    software,
    mentionsForSoftware:mentions
  }
}
