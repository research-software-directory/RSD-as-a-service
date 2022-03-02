import {HTMLAttributes, useState} from 'react'

import AsyncAutocomplete from '../../../form/AsyncAutocomplete'
import {Contributor, SearchContributor} from '../../../../types/Contributor'
import {searchForContributor} from '../../../../utils/editContributors'
import {AutocompleteOption} from '../../../../types/AutocompleteOptions'
import FindContributorItem from './FindContributorItem'
import {splitName} from '../../../../utils/getDisplayName'
import {contributorInformation as config} from '../editSoftwareConfig'

export type Name = {
  given_names: string
  family_names?: string
}

export default function FindContributor({onAdd, onCreate}:
  { onAdd: (item: Contributor) => void, onCreate:(name:Name)=>void}) {
  const [options, setOptions] = useState<AutocompleteOption<SearchContributor>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchContributor(searchFor: string) {
    setStatus({loading:true,foundFor:undefined})
    const resp = await searchForContributor({
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

  function addContributor(selected:AutocompleteOption<SearchContributor>) {
    if (selected && selected.data) {
      onAdd({
        ...selected.data,
        is_contact_person: false,
        software: ''
      })
    }
  }

  function createNewContributor(newInputValue: string) {
    const name = splitName(newInputValue)
    onCreate(name)
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SearchContributor>,
    state: object) {
    return (
      <li {...props} key={option.key}>
        <FindContributorItem option={option} />
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocomplete
        status={status}
        options={options}
        onSearch={searchContributor}
        onAdd={addContributor}
        onCreate={createNewContributor}
        onRenderOption={renderOption}
        config={{
          freeSolo: true,
          minLength: config.findContributor.validation.minLength,
          label: config.findContributor.label,
          help: config.findContributor.help
        }}
      />
    </section>
  )
}
