// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {SpdxLicense} from '~/types/SpdxLicense'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import {License} from '~/types/SoftwareTypes'
import {sortOnStrProp} from '../sortFn'

export type SpdxLicenseResponse = {
  licenseListVersion: string,
  licenses: SpdxLicense[],
  releaseDate: string
}

import spdxLicenses from './spdxLisences.json'

const useSpdxLicenses=jest.fn(({software}:{software?:string})=>{
  const [options, setOptions] = useState<AutocompleteOption<License>[]>([])
  const [loading, setLoading] = useState(true)

  // console.group('useSpdxLicenses...MOCKED')
  // console.log('loading...', loading)
  // console.log('options...', options)
  // console.groupEnd()

  useEffect(() => {
    let abort=false
    async function getData() {
      setLoading(true)
      const json:SpdxLicenseResponse = spdxLicenses
      // if licenses
      if (json?.licenses) {
        const options = json.licenses
          // only valid licenses
          // .filter(item => item.isDeprecatedLicenseId === false)
          // ordered on licenseId
          .sort((a,b)=>sortOnStrProp(a,b,'licenseId'))
          .map(item => {
            return {
              key: item.licenseId,
              label: item.name,
              data: {
                software,
                license: item.licenseId,
                deprecated: item.isDeprecatedLicenseId,
                reference: item.reference,
                name: item.name,
                // app spdx licenses are open source
                open_source: true,
              }
            } as AutocompleteOption<License>
          })
        // exit on abort
        if (abort === true) return
        // update state
        setOptions(options)
        setLoading(false)
      }
    }

    getData()

    return ()=>{abort=true}
  }, [software])

  return {
    loading,
    options
  }
})

export default useSpdxLicenses
