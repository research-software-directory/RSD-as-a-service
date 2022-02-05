import {useEffect, useState, useContext} from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import {Controller} from 'react-hook-form'

import {getTagsForSoftware} from '../../../utils/getSoftware'
import editSoftwareContext from './editSoftwareContext'
import {editConfigStep1 as config} from './editConfig'
import {Tag} from '../../../types/SoftwareTypes'
import useTagOptions from '../../../utils/useTagOptions'
import ControlledAutocomplete,{AutocompleteOption} from '../../form/ControlledAutocomplete'

export default function SoftwareKeywords({control, setValue}: { control: any, setValue:any }) {
  const {pageState:{software}} = useContext(editSoftwareContext)
  const tags = useTagOptions(software?.id||'')
  const [options, setOptions] = useState<AutocompleteOption<Tag>[]>([])

  useEffect(() => {
    setOptions(tags)
  },[tags])

  // useEffect(() => {
  //   let abort=false
  //   if (software?.id) {
  //     getTagsForSoftware(software.id,true)
  //       .then(resp => {
  //         if (abort === true) return
  //         const selection = resp?.map(item => {
  //           return {
  //             key: item.tag,
  //             label: item.tag,
  //             data: item
  //           }
  //         })
  //         // selection from database
  //         if (selection && selection?.length > 0) {
  //           // use react hook form method to update
  //           setValue('tags',selection)
  //         }
  //       })
  //   }
  //   return ()=>{abort=true}
  // },[software?.id, setValue])

  return (
    <ControlledAutocomplete
      name="tags"
      control={control}
      options={options}
      label={config.tags.help}
    />
  )
}
