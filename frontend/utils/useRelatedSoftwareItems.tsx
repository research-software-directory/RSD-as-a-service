import {useEffect, useState} from 'react'
// import {softwareOfCurrenMaintaner} from '../auth/maintainer'
import {AutocompleteOptionWithLink} from '../types/AutocompleteOptions'
import {RelatedSoftware} from '../types/SoftwareTypes'

import {getRelatedToolsForSoftware, relatedToolsToOptionsWithLink} from './editRelatedSoftware'

export default function useRelatedSoftwareItems({software,token}:{software:string,token:string}) {
  const [selected, setSelected] = useState<AutocompleteOptionWithLink<RelatedSoftware>[]>([])

  useEffect(() => {
    let abort = false

    async function getData() {
      const relatedTools = await getRelatedToolsForSoftware({
        software,
        columns: 'id,slug,brand_name',
        token,
        frontend: true
      })
      // exit on abort
        if (abort) return
      if (relatedTools && relatedTools?.length > 0) {
        const options = relatedToolsToOptionsWithLink(relatedTools)
        setSelected(options)
      } else {
        setSelected([])
      }
    }
    // only when info provided
    if (software && token) {
      getData()
    }

    return () => {abort = true}
  }, [software,token])

  return selected
}
