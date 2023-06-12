// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {SpdxLicense} from '../../types/SpdxLicense'
import {sortOnStrProp} from '../sortFn'
import {AutocompleteOption} from '../../types/AutocompleteOptions'
import {License} from '~/types/SoftwareTypes'

export type SpdxLicenseResponse = {
  licenseListVersion: string,
  licenses: SpdxLicense[],
  releaseDate: string
}

import spdxLicenses from './spdxLisences.json'

export default function useSpdxLicenses({software}:{software?:string}) {
  const [options, setOptions] = useState<AutocompleteOption<License>[]>([])
  const [loading, setLoading] = useState(true)

  // console.group('useSpdxLicenses...MOCKED')
  // console.log('loading...', loading)
  // console.log('options...', options)
  // console.groupEnd()

  useEffect(() => {
    let abort=false
    async function getData(software:string) {
      setLoading(true)
      const json:SpdxLicenseResponse = spdxLicenses
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
