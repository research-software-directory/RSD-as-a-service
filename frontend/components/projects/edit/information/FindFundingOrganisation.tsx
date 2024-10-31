// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'

import AsyncAutocompleteSC, {
  AsyncAutocompleteConfig, AutocompleteOption
} from '~/components/form/AsyncAutocompleteSC'
import {SearchOrganisation} from '../../../../types/Organisation'
import FindOrganisationItem from '../../../software/edit/organisations/FindOrganisationItem'

type SearchForOrganisationProps = {
  searchFor: string,
  frontend: boolean
}

type FindOrganisationProps = {
  config: AsyncAutocompleteConfig
  searchForOrganisation: (props:SearchForOrganisationProps) => Promise<AutocompleteOption<SearchOrganisation>[]>
  onAdd: (item: SearchOrganisation) => void
  onCreate?: (name: string) => void
}

export default function FindOrganisation({config,onAdd,onCreate,searchForOrganisation}:FindOrganisationProps) {
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
    const options = await searchForOrganisation({
      searchFor,
      frontend:true
    })
    // set options
    setOptions(options)
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
    if (onCreate) onCreate(newInputValue)
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
    option: AutocompleteOption<SearchOrganisation>
  ) {
    // when value is not not found option returns input prop
    if (option?.input && onCreate) {
      // if input is over minLength
      if (option?.input.length > config.minLength) {
        // we offer an option to create this entry
        return renderAddOption(props,option)
      } else {
        return null
      }
    }
    return (
      <li {...props} key={option.key}>
        <FindOrganisationItem {...option.data} />
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
          ...config,
          // freeSolo allows create option
          // if onCreate fn is not provided
          // we do not allow free solo text
          // eg. only selection of found items
          freeSolo: onCreate ? true : false
        }}
      />
    </section>
  )
}
