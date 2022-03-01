import {useContext} from 'react'

import editSoftwareContext from '../editSoftwareContext'
import useSpdxLicenses from '../../../../utils/useSpdxLicenses'
import {softwareInformation as config} from '../editSoftwareConfig'
import ControlledAutocomplete from '../../../form/ControlledAutocomplete'

export default function SoftwareLicenses({control}:{control:any}) {
  const {pageState:{software}} = useContext(editSoftwareContext)
  const options = useSpdxLicenses()
  return (
    <ControlledAutocomplete
      name="licenses"
      control={control}
      options={options}
      label={config.licenses.help}
    />
  )
}
