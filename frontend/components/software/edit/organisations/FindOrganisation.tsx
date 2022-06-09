// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'

// import AsyncAutocomplete from '../../../form/AsyncAutocomplete'
// import {AutocompleteOption} from '../../../../types/AutocompleteOptions'
import AsyncAutocompleteSC, {AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'
import FindOrganisationItem from './FindOrganisationItem'
import {organisationInformation as config} from '../editSoftwareConfig'
import {SearchOrganisation} from '../../../../types/Organisation'
import {searchForOrganisation} from '../../../../utils/editOrganisation'

export default function FindOrganisation({onAdd, onCreate}:
  { onAdd: (item: SearchOrganisation) => void, onCreate:(name:string)=>void}) {
  const [options, setOptions] = useState<AutocompleteOption<SearchOrganisation>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchOrganisation(searchFor: string) {
    setStatus({loading:true,foundFor:undefined})
    const resp = await searchForOrganisation({
      searchFor,
      frontend:true
    })
    // set options
    setOptions(resp ?? [])
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  function onAddOrganisation(selected:AutocompleteOption<SearchOrganisation>) {
    if (selected && selected.data) {
      onAdd({
        ...selected.data
      })
    }
  }

  function createOrganisation(newInputValue: string) {
    onCreate(newInputValue)
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SearchOrganisation>) {
    // if more than one option we add border at the bottom
    // we assume that first option is Add "new item"
    if (options.length > 1 && onCreate) {
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
    option: AutocompleteOption<SearchOrganisation>,
    state: object) {
    // when value is not not found option returns input prop
    if (option?.input && onCreate) {
      // if input is over minLength
      if (option?.input.length > config.findOrganisation.validation.minLength) {
        // we offer an option to create this entry
        return renderAddOption(props,option)
      } else {
        return null
      }
    }
    return (
      <li {...props} key={option.key}>
        <FindOrganisationItem option={option} />
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchOrganisation}
        onAdd={onAddOrganisation}
        onCreate={createOrganisation}
        onRenderOption={renderOption}
        config={{
          freeSolo: true,
          minLength: config.findOrganisation.validation.minLength,
          label: config.findOrganisation.label,
          help: config.findOrganisation.help,
          reset: true
        }}
      />
    </section>
  )
}
