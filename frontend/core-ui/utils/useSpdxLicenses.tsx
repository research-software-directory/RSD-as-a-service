// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import logger from './logger'
import {SpdxLicense} from '../types/SpdxLicense'
import {sortOnStrProp} from './sortFn'
import {AutocompleteOption} from '../types/AutocompleteOptions'
import {License} from '~/types/SoftwareTypes'

export type SpdxLicenseResponse = {
  licenseListVersion: string,
  licenses: SpdxLicense[],
  releaseDate: string
}

const url = 'https://raw.githubusercontent.com/spdx/license-list-data/master/json/licenses.json'

export default function useSpdxLicenses({software}:{software?:string}) {
  const [options, setOptions] = useState<AutocompleteOption<License>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort=false
    async function getData(software:string) {
      const resp = await fetch(url)
      if (resp.status === 200) {
        setLoading(true)
        const json:SpdxLicenseResponse = await resp.json()
        // if licenses
        if (json?.licenses) {
          const options = json.licenses
            // only valid liceses
            // .filter(item => item.isDeprecatedLicenseId === false)
            // ordered on licenseId
            .sort((a,b)=>sortOnStrProp(a,b,'licenseId'))
            .map(item => {
              return {
                key: item.licenseId,
                label: item.licenseId,
                data: {
                  id: undefined,
                  software,
                  license: item.licenseId,
                  deprecated: item.isDeprecatedLicenseId,
                  name: item.name
                }
              }
            })
          // exit on abort
          if (abort === true) return
          // update state
          setOptions(options)
          setLoading(false)
        }
      } else {
        logger(`useSpdxLicenses: ${resp.status}: ${resp.statusText}`, 'error')
        return []
      }
    }
    if (software) {
      getData(software)
    }
    return ()=>{abort=true}
  }, [software])

  return {
    loading,
    options
  }
}
