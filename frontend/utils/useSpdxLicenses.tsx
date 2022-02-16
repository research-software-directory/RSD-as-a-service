import {useEffect,useState} from 'react'

import {SpdxLicense} from '../types/SpdxLicense'
import {sortOnStrProp} from './sortFn'
import {AutocompleteOption} from '../types/AutocompleteOptions'
import logger from './logger'

export type SpdxLicenseResponse = {
  licenseListVersion: string,
  licenses: SpdxLicense[],
  releaseDate: string
}

const url = 'https://raw.githubusercontent.com/spdx/license-list-data/master/json/licenses.json'

export default function useSpdxLicenses() {
  const [options, setOptions] = useState<AutocompleteOption<SpdxLicense>[]>([])

  useEffect(() => {
    let abort=false
    async function getData() {
      const resp = await fetch(url)
      if (resp.status === 200) {
        const json:SpdxLicenseResponse = await resp.json()
        // exit on abort
        if (abort === true) return
        // if licenses
        if (json?.licenses) {
          const options = json.licenses
            // only valid liceses
            .filter(item => item.isDeprecatedLicenseId === false)
            // ordered on licenseId
            .sort((a,b)=>sortOnStrProp(a,b,'licenseId'))
            .map(item => {
              return {
                key: item.licenseId,
                label: item.licenseId,
                data: item
              }
            })
          // update state
          setOptions(options)
        }
      } else {
        logger(`useSpdxLicenses: ${resp.status}: ${resp.statusText}`, 'error')
        return []
      }
    }
    getData()
    return ()=>{abort=true}
  }, [])

  return options
}
