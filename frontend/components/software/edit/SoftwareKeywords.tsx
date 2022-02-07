import {useEffect, useState, useContext} from 'react'

import editSoftwareContext from './editSoftwareContext'
import {editConfigStep1 as config} from './editConfig'
import {Tag} from '../../../types/SoftwareTypes'
import useTagOptions from '../../../utils/useTagOptions'
import ControlledAutocomplete,{AutocompleteOption} from '../../form/ControlledAutocomplete'

export default function SoftwareKeywords({control}: {control: any}) {
  const {pageState:{software}} = useContext(editSoftwareContext)
  const tags = useTagOptions(software?.id||'')
  const [options, setOptions] = useState<AutocompleteOption<Tag>[]>([])

  useEffect(() => {
    setOptions(tags)
  },[tags])

  return (
    <ControlledAutocomplete
      name="tags"
      control={control}
      options={options}
      label={config.tags.help}
    />
  )
}
