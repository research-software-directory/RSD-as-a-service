import {useEffect, useState} from 'react'
import {AutocompleteOption, AutocompleteOptionWithLink} from '../types/AutocompleteOptions'
import {RelatedSoftware} from '../types/SoftwareTypes'
import {relatedSoftwareToOptions,relatedSoftwareToOptionsWithLink} from './editRelatedSoftware'
import {getRelatedSoftwareList} from './editRelatedSoftware'


export default function useRelatedSoftwareOptions({software,token}:{software:string,token:string}) {
  const [options, setOptions] = useState<AutocompleteOptionWithLink<RelatedSoftware>[]>([])

  useEffect(() => {
    let abort = false

    async function getData() {
      const resp = await getRelatedSoftwareList({software, token})
      // debugger
      if (resp.length > 0) {
        // prepare options
        const options = relatedSoftwareToOptionsWithLink(resp)
        // exit on abort
        if (abort) return
        // debugger
        setOptions(options)
      } else {
        setOptions([])
      }
    }
    // only when info provided
    if (software && token) {
      getData()
    }

    return () => {abort = true}
  }, [software,token])

  return options
}
