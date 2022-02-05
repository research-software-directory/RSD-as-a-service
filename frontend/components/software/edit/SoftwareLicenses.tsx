import {useEffect, useState, useContext} from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import {Controller} from 'react-hook-form'

import {getLicenseForSoftware} from '../../../utils/getSoftware'
import editSoftwareContext from './editSoftwareContext'
import logger from '../../../utils/logger'
import {SpdxLicense} from '../../../types/SpdxLicense'
import {sortOnStrProp} from '../../../utils/sortFn'
import useSpdxLicenses from '../../../utils/useSpdxLicenses'
import {editConfigStep1 as config} from './editConfig'
import ControlledAutocomplete,{AutocompleteOption} from '../../form/ControlledAutocomplete'
import {License} from '../../../types/SoftwareTypes'

export default function SoftwareLicenses({control}:{control:any}) {
  const {pageState:{software}} = useContext(editSoftwareContext)
  const options = useSpdxLicenses()
  // const [selection, setSelection] = useState<AutocompleteOption<License>[]>([])
  // useEffect(() => {
  //   if (software?.id) {
  //     getLicenseForSoftware(software.id,true)
  //       .then(resp => {
  //         // debugger
  //         const selection = resp?.map(item => {
  //           return {
  //             key: '',
  //             label: '',
  //             data: item
  //           }
  //         })
  //         setSelection(selection||[])
  //       })
  //   }
  // },[software?.id])

  return (
    <ControlledAutocomplete
      name="licenses"
      control={control}
      options={options}
      label={config.licenses.help}
    />
  )
}
