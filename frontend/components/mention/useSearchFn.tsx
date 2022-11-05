import {useEffect, useState} from 'react'
import {MentionItemProps} from '~/types/Mention'
import {AutocompleteOption} from '../form/AsyncAutocompleteSC'

type useSearchFnProps={
  searchFor: string,
  searchFn: (searchFor:string)=>Promise<MentionItemProps[]>
}

type useSearchState = {
  options: AutocompleteOption<MentionItemProps>[]
  loading: boolean
  searchFor: string
  foundFor?: string
}

export default function useSearchFn({searchFor, searchFn}: useSearchFnProps) {
  const [state, setState] = useState<useSearchState>({
    options: [],
    loading: true,
    searchFor
  })

  useEffect(() => {
    let abort=false
    async function searchForItems() {
      setState({
        options: [],
        loading: true,
        searchFor,
      })
      // make request
      // console.log('call searchFn for...', searchFor)
      const resp = await searchFn(searchFor)
      // console.log('abort...', abort)
      const options = resp.map((item,pos) => ({
        key: pos.toString(),
        label: item.title ?? '',
        data: item
      }))
      // debugger
      // if cancel is used we abort this function
      if (abort) return
      // debugger
      setState({
        searchFor,
        options,
        loading: false,
        foundFor: searchFor
      })
    }
    if (searchFor &&
      abort === false
    ) {
      // debugger
      searchForItems()
    }
    return () => {
      // debugger
      abort=true
    }
  }, [searchFor, searchFn])

  return {
    ...state
  }
}
