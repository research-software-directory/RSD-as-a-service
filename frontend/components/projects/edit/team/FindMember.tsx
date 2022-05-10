import {HTMLAttributes, useState} from 'react'

import AsyncAutocompleteSC, {AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'
import FindContributorItem from '~/components/software/edit/contributors/FindContributorItem'
import {SearchTeamMember, TeamMember} from '~/types/Project'
import {splitName} from '~/utils/getDisplayName'
import {cfgTeamMembers} from './config'
import {searchForMember} from './searchForMember'

type Name = {
  given_names: string
  family_names?: string
}

type FindMemberProps = {
  project: string,
  token: string,
  onAdd: (item: TeamMember) => void
}

export default function FindMember({onAdd,project,token}:FindMemberProps) {
  const [options, setOptions] = useState<AutocompleteOption<SearchTeamMember>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchMember(searchFor: string) {
    setStatus({loading:true,foundFor:undefined})
    const resp = await searchForMember({
      searchFor,
      token,
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

  function addMember(selected:AutocompleteOption<SearchTeamMember>) {
    if (selected && selected.data) {
      onAdd({
        ...selected.data,
        id: null,
        project,
        is_contact_person: false,
        role: null,
      })
    }
  }

  function createMember(newInputValue: string) {
    const name = splitName(newInputValue)
    // add new person
    onAdd({
      id: null,
      project,
      is_contact_person: false,
      ...name,
      email_address: null,
      affiliation: null,
      role: null,
      orcid: null,
      avatar_data: null,
      avatar_mime_type: null,
      avatar_b64: null
    })
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SearchTeamMember>) {
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
    option: AutocompleteOption<SearchTeamMember>) {
    // console.log('renderOption...', option)
    // when value is not not found option returns input prop
    if (option?.input) {
      // if input is over minLength
      if (option?.input.length > cfgTeamMembers.find.validation.minLength) {
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
        onSearch={searchMember}
        onAdd={addMember}
        onCreate={createMember}
        onRenderOption={renderOption}
        config={{
          freeSolo: true,
          minLength: cfgTeamMembers.find.validation.minLength,
          label: cfgTeamMembers.find.label,
          help: cfgTeamMembers.find.help,
          // clear selected item
          reset: true
        }}
      />
    </section>
  )
}
