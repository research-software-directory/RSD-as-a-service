import {useContext, useState} from 'react'
import {Control, useFieldArray, useForm} from 'react-hook-form'

import GetLicensesFromDoi from './GetLicensesFromDoi'
import editSoftwareContext from '../editSoftwareContext'
import {softwareInformation as config} from '../editSoftwareConfig'
import useSpdxLicenses from '~/utils/useSpdxLicenses'
import {getLicensesFromDoi} from '~/utils/getInfoFromDatacite'
import ControlledAutocomplete from '~/components/form/ControlledAutocomplete'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import {SpdxLicense} from '~/types/SpdxLicense'
import {EditSoftwareItem, License} from '~/types/SoftwareTypes'

type SoftwareLicensesProps = {
  control: Control<EditSoftwareItem, AutocompleteOption<License>[]>,
  concept_doi?: string
}


export default function SoftwareLicenses(
  {control, concept_doi}:SoftwareLicensesProps
) {
  // const {pageState: {software}} = useContext(editSoftwareContext)
  const options = useSpdxLicenses()
  const [loading, setLoading] = useState(false)
  const {getValues} = useForm<EditSoftwareItem>()
  const {fields, append} = useFieldArray({
    control,
    name: 'licenses',
    // change internal key name from id to fid
    // to avoid conflict with id prop in data
    keyName: 'fid'
  })

  const licenses = getValues('licenses')

  console.group('SoftwareLicenses')
  console.log('licenses...', licenses)
  console.log('fields...', fields)
  console.groupEnd()


  async function onGetLicensesFromDoi() {
    setLoading(true)
    // collect here new to add licenses
    const toAddLicenses: AutocompleteOption<SpdxLicense>[] = []
    // fetch licenses from DOI
    const licenses = await getLicensesFromDoi(concept_doi)

    // find licenses SPDX keys that match items in the options
    for (const license of licenses) {
      const found = options.filter(
        item => item.key.toLowerCase() === license.toLowerCase()
      )
      if (found.length === 1) {
        // add this choice
        // toAddLicenses.push(found[0])
        append({
          id: null,
          sofware: 'qweqweqwe',
          lisense
        })
      }
    }
    if (toAddLicenses.length > 0) {
      console.log('Add licenses...', toAddLicenses)
    }
    setLoading(false)
  }

  // function onChange(e: any, items: any, reason: any) {
  //   for (const i of items) {
  //     const foundFields = fields.filter((item: any) => item.key === i.key)

  //     // do not add twice
  //     if (foundFields.length === 0) {
  //       append(i)
  //     }
  //   }
  // }

  return (
    <>
      <ControlledAutocomplete
        name="licenses"
        control={control}
        options={options}
        label={config.licenses.help}
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
