import {useEffect, useState} from 'react'
// import {softwareOfCurrenMaintaner} from '../auth/maintainer'
import {AutocompleteOption} from '../types/AutocompleteOptions'
import {RelatedSoftware} from '../types/SoftwareTypes'

import {getRelatedToolsForSoftware, relatedToolsToOptions} from './editRelatedSoftware'

export default function useRelatedSoftwareItems({software,token}:{software:string,token:string}) {
  const [selected, setSelected] = useState<AutocompleteOption<RelatedSoftware>[]>([])

  useEffect(() => {
    let abort = false

    async function getData() {
      const relatedTools = await getRelatedToolsForSoftware({software, token, frontend: true})
      // exit on abort
        if (abort) return
      if (relatedTools && relatedTools?.length > 0) {
        const options = relatedToolsToOptions(relatedTools)
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
