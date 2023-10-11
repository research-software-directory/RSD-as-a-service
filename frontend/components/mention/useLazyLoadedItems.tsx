import {useEffect, useState} from 'react'
import {MentionItemProps} from '~/types/Mention'

type LazyLoadedItemsProps={
  items: MentionItemProps[],
  ofset: number,
  limit: number
}

export default function useLazyLoadedItems({items,ofset,limit=12}:LazyLoadedItemsProps){
  const [mentions, setMentions] = useState<MentionItemProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let abort = false
    if (items?.length > mentions?.length){
      setLoading(true)
      let start = mentions.length
      let end = ofset + limit
      if (end > items.length){
        // debugger
        end = items.length
      }
      if (start >= end) return
      if (abort) return

      const newList=[
        ...mentions,
        ...items.slice(start,end)
      ]
      // debugger
      setMentions(newList)
      setLoading(false)
    }

    return ()=>{abort=true}
  },[items,ofset,limit,mentions])

  return {
    mentions,
    loading,
    hasMore: mentions.length < items.length
  }
}
