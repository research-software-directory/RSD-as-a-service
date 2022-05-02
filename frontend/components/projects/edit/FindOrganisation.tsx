import {HTMLAttributes, useState} from 'react'

import AsyncAutocomplete, {AsyncAutocompleteConfig} from '../../form/AsyncAutocomplete'
import {AutocompleteOption} from '../../../types/AutocompleteOptions'
import {SearchOrganisation} from '../../../types/Organisation'
import {searchForOrganisation} from '../../../utils/editOrganisation'
import FindOrganisationItem from '../../software/edit/organisations/FindOrganisationItem'

export default function FindOrganisation({config, onAdd, onCreate}:
  { config: AsyncAutocompleteConfig, onAdd: (item: SearchOrganisation) => void, onCreate?:(name:string)=>void}) {
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
    if (onCreate) onCreate(newInputValue)
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SearchOrganisation>,
    state: object) {
    return (
      <li {...props} key={option.key}>
        <FindOrganisationItem option={option} />
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocomplete
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
