import {HTMLAttributes, useState} from 'react'

import {Contributor, SearchContributor} from '../../../../types/Contributor'
import {searchForContributor} from '../../../../utils/editContributors'
import FindContributorItem from './FindContributorItem'
import {splitName} from '../../../../utils/getDisplayName'
import {contributorInformation as config} from '../editSoftwareConfig'
import AsyncAutocompleteSC,{AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'

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

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SearchContributor>) {
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
    option: AutocompleteOption<SearchContributor>) {
    // console.log('renderOption...', option)
    // when value is not not found option returns input prop
    if (option?.input) {
      // if input is over minLength
      if (option?.input.length > config.findContributor.validation.minLength) {
        // we offer an option to create this entry
        return renderAddOption(props,option)
      } else {
        return null
      }
    }

    return (
      <li {...props} key={Math.random().toString()}>
        <FindContributorItem option={option} />
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocompleteSC
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
