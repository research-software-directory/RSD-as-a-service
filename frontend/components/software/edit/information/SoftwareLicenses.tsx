// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'
import {Control, useFieldArray, useForm} from 'react-hook-form'

import GetLicensesFromDoi from './GetLicensesFromDoi'
import {softwareInformation as config} from '../editSoftwareConfig'
import useSpdxLicenses from '~/utils/useSpdxLicenses'
import {getLicensesFromDoi} from '~/utils/getInfoFromDatacite'
import {EditSoftwareItem, License} from '~/types/SoftwareTypes'
import AsyncAutocompleteSC, {
  AutocompleteOption
} from '~/components/form/AsyncAutocompleteSC'
import Chip from '@mui/material/Chip'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortBySearchFor} from '~/utils/sortFn'

type SoftwareLicensesProps = {
  control: Control<EditSoftwareItem, AutocompleteOption<License>[]>,
  software: string,
  concept_doi?: string
}

export default function SoftwareLicenses(
  {control, software, concept_doi}:SoftwareLicensesProps
) {
  const {showSuccessMessage, showInfoMessage} = useSnackbar()
  const {options:allOptions} = useSpdxLicenses({software})
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })
  const [options, setOptions] = useState<AutocompleteOption<License>[]>(allOptions)
  const [doiLoad, setDoiLoad]=useState(false)
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'licenses',
    // change internal key name from id to fid
    // to avoid conflict with id prop in data
    keyName: 'fid'
  })

  // console.group('SoftwareLicenses')
  // console.log('licenses...', licenses)
  // console.log('fields...', fields)
  // console.groupEnd()

  async function onGetLicensesFromDoi() {
    let added = 0
    setDoiLoad(true)
    // collect here new to add licenses
    const toAddLicenses: AutocompleteOption<License>[] = []
    // fetch licenses from DOI
    const licenses = await getLicensesFromDoi(concept_doi)
    // find licenses SPDX keys that match items in the options
    for (const license of licenses) {
      // exlude if already in fields
      const find = fields.filter(item => item.key.toLowerCase() === license.toLowerCase())
      if (find.length > 0) {
        continue
      }
      added++
      // improve identifier
      const spdx = allOptions.find(item=>item.key.toLocaleLowerCase()===license.toLowerCase())
      // add to fields collection
      append({
        key: spdx?.key ?? license,
        label: spdx?.key ?? license,
        data: {
          id: undefined,
          software,
          license: spdx?.key ?? license
        }
      })
    }
    setDoiLoad(false)
    if (added > 0) {
      showSuccessMessage(`${added} liceses imported from DOI ${concept_doi}`)
    } else {
      showInfoMessage(`No (additional) license to import from DOI ${concept_doi}`)
    }
  }

  function searchLicense(searchFor: string) {
    // console.log('searchLicense...searchFor...', searchFor)
    // set loading status and clear foundFor
    setStatus({loading: true, foundFor: undefined})
    // filter options
    const found = allOptions.filter(item => {
      // filter what is found
      return item.label.toLowerCase().includes(searchFor.toLowerCase())
    }).map(item => {
      return {
        key: item.key,
        label: item.label,
        data: {
          id: undefined,
          software,
          license: item.label,
          deprecated: item.data.deprecated
        }
      }
    })
    const sorted = found.sort((a, b) => sortBySearchFor(a, b, 'label', searchFor))
    debugger
    // set options
    setOptions(found)
    // debugger
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  function onAddLicense(selected: AutocompleteOption<License>) {
    // check if already added
    const find = fields.filter(item => item.label.toLocaleLowerCase() === selected.label.toLocaleLowerCase())
    // otherwise add it
    if (find.length === 0) {
      append(selected)
    }
  }

  function createLicense(newInputValue: string) {
    const find = fields.filter(item => item.label.toLowerCase() === newInputValue.toLowerCase())
    // otherwise add it
    if (find.length === 0) {
      append({
        key: newInputValue,
        label: newInputValue,
        data: {
          id: undefined,
          software,
          license: newInputValue
        }
      })
    }
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<License>) {
    // if more than one option we add border at the bottom
    // we assume that first option is Add "new item"
    if (options.length > 1) {
      if (props?.className) {
        props.className+=' mb-2 border-b'
      } else {
        props.className='mb-2 border-b'
      }
    }
    return (
      <li {...props} key={option.key}>
        {/* if new option (has input) show label and count  */}
        <strong>{`Add "${option.label}"`}</strong>
      </li>
    )
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<License>,
    state: object) {
    // console.log('renderOption...', option)
    // when value is not found option returns input prop
    if (option?.input) {
      // if input is over minLength
      if (option?.input.length > 3) {
        // we offer an option to create this entry
        return renderAddOption(props,option)
      } else {
        return null
      }
    }
    return (
      <li {...props} key={option.key}>
        {/* if new option (has input) show label and count  */}
        {option.data?.deprecated ?
          <span className="text-grey-500">{option.label} (DEPRECATED)</span>
          : <span>{option.label}</span>
        }
      </li>
    )
  }

  function onRemove(pos:number) {
    remove(pos)
  }

  return (
    <>
      <div className="flex flex-wrap py-2">
      {fields.map((field, pos) => {
        return(
          <div
            key={field.fid}
            className="py-1 pr-1"
          >
            <Chip
              title={field.label}
              label={field.label}
              onDelete={() => onRemove(pos)}
            />
          </div>
        )
      })}
      </div>
      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchLicense}
        onAdd={onAddLicense}
        onCreate={createLicense}
        onRenderOption={renderOption}
        config={{
          // freeSolo allows create option
          // if onCreate fn is not provided
          // we do not allow free solo text
          // eg. only selection of found items
          freeSolo: true,
          minLength: config.licenses.validation.minLength,
          label: config.licenses.label,
          help: config.licenses.help,
          reset: true
        }}
      />
      {
        concept_doi &&
        <div className="pt-4 pb-0">
          <GetLicensesFromDoi
            onClick={onGetLicensesFromDoi}
            title={config.importLicenses.message(concept_doi)}
            loading={doiLoad}
          />
        </div>
      }
    </>
  )
}
