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
  // stringify items to compare and track change
  // this ensures updates when items are updated/deleted
  const [strItems, setStrItems] = useState(JSON.stringify(items))

  // console.group('useLazyLoadedItems')
  // console.log('mentions...', mentions)
  // console.log('items...', items)
  // console.groupEnd()

  useEffect(()=>{
    let abort = false
    if (items?.length > 0){
      setLoading(true)
      let end = ofset + limit
      if (end > items.length){
        //
        end = items.length
      }
      // prevent endless loop
      if (mentions.length >= end &&
        JSON.stringify(items) === strItems
      ) {
        // exit effect without update
        return
      }
      // prevent updates on the "old" hook effect
      if (abort) return
      // always use new items elements
      // because the items can be updated/deleted
      const newList=items.slice(0,end)
      // console.group('useLazyLoadedItems')
      // console.log('newList...', newList)
      // console.log('items...', items)
      // console.groupEnd()
      // debugger
      setMentions(newList)
      // save items
      setStrItems(JSON.stringify(items))
      setLoading(false)
    }
    return ()=>{abort=true}
  },[items,ofset,limit,mentions,strItems])

  return {
    mentions,
    loading,
    hasMore: mentions.length < items.length
  }
}
