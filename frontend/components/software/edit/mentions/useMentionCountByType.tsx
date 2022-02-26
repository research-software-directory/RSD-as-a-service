import {useEffect, useState} from 'react'

import {MentionEditType, MentionForSoftware} from '../../../../types/MentionType'
import {getMentionsForSoftware} from '../../../../utils/editMentions'
import {MentionByType} from '../../MentionsByType'
import {initialCount,MentionCountByType} from './MentionCountContext'

function countMentionsByType(mentions:MentionForSoftware[]) {
  let mentionByType: MentionByType = {}
  let countByType = initialCount

  // classify mentions by type
  mentions.forEach(item => {
    let mType = item?.type as string ?? 'default'
    if (mentionByType?.hasOwnProperty(item.type)) {
      mentionByType[mType].push(item)
    } else {
      // create array for new type
      mentionByType[mType] = []
      // and add this item
      mentionByType[mType].push(item)
    }
  })

  // calculation
  Object.keys(countByType).map(key => {
    if (mentionByType?.hasOwnProperty(key)) {
      countByType[key as MentionEditType] = mentionByType[key].length
    } else {
      countByType[key as MentionEditType] = 0
    }
  })

  return countByType
}


export default function useMentionCountByType({software, token}:
  {software: string, token: string}) {
  const [count, setCount] = useState<MentionCountByType>()
  const [loading, setLoading] = useState(true)

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
      const counts = countMentionsByType(mentions ?? [])
      setCount(counts)
      setLoading(false)
    }
    if (typeof software != 'undefined' && token) {
      getMentions(software,token)
    }
    return ()=>{abort=true}
  }, [software, token])

  // console.group('useMentionCountByType')
  // console.log('count...', count)
  // console.log('loading...', loading)
  // console.groupEnd()

  return {count, loading}
}
