import {HTMLAttributes, useState} from 'react'

import AsyncAutocomplete from '../../../form/AsyncAutocomplete'
import {AutocompleteOption} from '../../../../types/AutocompleteOptions'
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
          freeSolo: true,
          minLength: config.findOrganisation.validation.minLength,
          label: config.findOrganisation.label,
          help: config.findOrganisation.help
        }}
      />
    </section>
  )
}
