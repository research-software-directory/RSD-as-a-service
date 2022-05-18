import {useContext, useState} from 'react'
import {useFieldArray} from 'react-hook-form'

import GetLicensesFromDoi from './GetLicensesFromDoi'
import editSoftwareContext from '../editSoftwareContext'
import {softwareInformation as config} from '../editSoftwareConfig'
import useSpdxLicenses from '~/utils/useSpdxLicenses'
import {getLicensesFromDoi} from '~/utils/getInfoFromDatacite'
import ControlledAutocomplete from '~/components/form/ControlledAutocomplete'

export default function SoftwareLicenses(
  {control, concept_doi}:
  { control: any, concept_doi?: string }
) {
  const {pageState: {software}} = useContext(editSoftwareContext)
  const options = useSpdxLicenses()
  const [loading, setLoading] = useState(false)
  const {fields, append} = useFieldArray({
    control,
    name: 'licenses'
  })

  async function onGetLicensesFromDoi() {
    setLoading(true)

    const licenses: any = await getLicensesFromDoi(concept_doi)

    for (const license of licenses) {
      const found = options.filter(
        item => item.key.toLowerCase() === license.toLowerCase()
      )

      if (found.length === 1) {
        append(found)
      }
    }

    setLoading(false)
  }

  function onChange(e: any, items: any, reason: any) {
    for (const i of items) {
      const foundFields = fields.filter((item: any) => item.key === i.key)

      // do not add twice
      if (foundFields.length === 0) {
        append(i)
      }
    }
  }

  return (
    <>
      <ControlledAutocomplete
        name="licenses"
        control={control}
        options={options}
        label={config.licenses.help}
        onChange={onChange}
      />
      {
        concept_doi &&
        <div className="pt-4 pb-0">
          <GetLicensesFromDoi
            onClick={onGetLicensesFromDoi}
            title={config.importLicenses.message(concept_doi)}
            loading={loading}
          />
        </div>
      }
    </>
  )
}
