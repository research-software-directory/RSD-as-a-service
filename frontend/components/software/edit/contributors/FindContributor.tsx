// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'

import {Contributor, SearchPerson} from '../../../../types/Contributor'
import {searchForContributor} from '../../../../utils/editContributors'
import FindContributorItem from './FindContributorItem'
import {splitName} from '../../../../utils/getDisplayName'
import {contributorInformation as config} from '../editSoftwareConfig'
import AsyncAutocompleteSC,{AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'
import {isOrcid} from '~/utils/getORCID'
import {useSession} from '~/auth'

export type Name = {
  given_names: string
  family_names?: string
}

type FindContributorProps = {
  software: string,
  onAdd: (item: Contributor) => void
}

export default function FindContributor({onAdd, software}:FindContributorProps) {
  const {token} = useSession()
  const [options, setOptions] = useState<AutocompleteOption<SearchPerson>[]>([])
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

  function addContributor(selected:AutocompleteOption<SearchPerson>) {
    if (selected && selected.data) {
      onAdd({
        ...selected.data,
        id: null,
        software: '',
        is_contact_person: false,
        role: null,
        position: null,
        // RSD entries could have avatar
        avatar_id: selected.data.avatar_id ?? null
      })
    }
  }

  function createNewContributor(newInputValue: string) {
    const name = splitName(newInputValue)
    // onCreate(name)
    onAdd({
      id: null,
      software,
      is_contact_person: false,
      ...name,
      email_address: null,
      affiliation: null,
      role: null,
      orcid: null,
      avatar_id: null,
      avatar_mime_type: null,
      avatar_b64: null,
      position: null
    })
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SearchPerson>) {
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
    option: AutocompleteOption<SearchPerson>) {
    // console.log('renderOption...', option)
    // when value is not found option returns input prop
    if (option?.input) {
      // add option is NOT available when searching by ORCID
      if (isOrcid(option?.input)===false) {
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
          forceShowAdd: true,
          minLength: config.findContributor.validation.minLength,
          label: config.findContributor.label,
          help: config.findContributor.help,
          // clear selected item
          reset: true
        }}
      />
    </section>
  )
}
