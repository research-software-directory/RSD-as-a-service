// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'

import {useSession} from '~/auth'
import {softwareInformation as config} from '../editSoftwareConfig'
import useSpdxLicenses from '~/utils/useSpdxLicenses'
import {License} from '~/types/SoftwareTypes'
import AsyncAutocompleteSC, {
  AutocompleteOption
} from '~/components/form/AsyncAutocompleteSC'
import Chip from '@mui/material/Chip'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortBySearchFor} from '~/utils/sortFn'
import ImportLicensesFromDoi from './ImportLicensesFromDoi'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useSoftwareContext from '../useSoftwareContext'
import {addLicensesForSoftware, deleteLicense} from '~/utils/editSoftware'

export type SoftwareLicensesProps = {
  items: AutocompleteOption<License>[]
  concept_doi?: string
}

export default function AutosaveSoftwareLicenses({concept_doi, items}: SoftwareLicensesProps) {
  const {token} = useSession()
  const {software: {id}} = useSoftwareContext()
  const {showErrorMessage} = useSnackbar()
  const {options:allOptions} = useSpdxLicenses({software:id??''})
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })
  const [options, setOptions] = useState<AutocompleteOption<License>[]>(allOptions)
  const [licenses, setLicenses] = useState(items)

  // console.group('AutosaveSoftwareLicenses')
  // console.log('licenses...', licenses)
  // console.log('fields...', fields)
  // console.groupEnd()

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
          software: id ?? '',
          license: item.label,
          deprecated: item.data.deprecated,
          name: item.data.name
        }
      }
    })
    const sorted = found.sort((a, b) => sortBySearchFor(a, b, 'label', searchFor))
    // debugger
    // set options
    setOptions(sorted)
    // debugger
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  async function onAddLicense(selected: AutocompleteOption<License>) {
    // check if already added
    const find = licenses.filter(item => item.label.toLocaleLowerCase() === selected.label.toLocaleLowerCase())
    // otherwise add it
    if (find.length === 0) {
      const resp = await addLicensesForSoftware({
        software: id ?? '',
        license: selected.key,
        token
      })
      if (resp.status === 201) {
        // update id
        selected.data.id = resp.message
        const newList = [
          ...licenses,
          selected
        ]
        setLicenses(newList)
      } else {
        showErrorMessage(`Failed to add license. ${resp.message}`)
      }
    }
  }

  function createLicense(newInputValue: string) {
    const find = licenses.filter(item => item.label.toLowerCase() === newInputValue.toLowerCase())
    // otherwise add it
    if (find.length === 0) {
      const license = {
        key: newInputValue,
        label: newInputValue,
        data: {
          id: undefined,
          software: id ?? '',
          license: newInputValue,
          name: newInputValue
        }
      }
      onAddLicense(license)
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

  async function onRemove(pos: number) {
    const item = licenses[pos]
    if (item.data.id) {
      const resp = await deleteLicense({
        id: item.data.id,
        token
      })
      if (resp.status === 200) {
        // remove(pos)
        const newList = [
          ...licenses.slice(0, pos),
          ...licenses.slice(pos+1)
        ]
        setLicenses(newList)
      } else {
        showErrorMessage(`Failed to remove license. ${resp.message}`)
      }
    } else {
      showErrorMessage('Failed to remove license. License id MISSING!')
    }
  }

  return (
    <>
      <EditSectionTitle
        title={config.licenses.title}
        subtitle={config.licenses.subtitle}
      />
      <div className="flex flex-wrap py-2">
      {licenses.map((item, pos) => {
        return(
          <div
            key={item.key}
            className="py-1 pr-1"
          >
            <Chip
              data-testid="license-chip"
              title={item.label}
              label={item.label}
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
          <ImportLicensesFromDoi
            concept_doi={concept_doi}
            items={licenses}
            onSetLicenses={setLicenses}
          />
        </div>
      }
    </>
  )
}
