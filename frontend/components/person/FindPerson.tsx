// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2025 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {splitName} from '~/utils/getDisplayName'
import {isOrcid} from '~/utils/getORCID'
import {Person} from '~/types/Contributor'
import AsyncAutocompleteSC,{AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'
import {searchForPerson} from '~/components/person/searchForPerson'
import {AggregatedPerson} from '~/components/person/groupByOrcid'
import AggregatedPersonOption from '~/components/person/AggregatedPersonOption'

type FindPersonProps = Readonly<{
  // create new Person
  onCreate: (person: Person) => void
  // edit aggregated person
  onAdd: (person: AggregatedPerson) => void
  config: {
    minLength: number,
    label: string,
    help: string,
    reset?: boolean,
    include_orcid?: boolean,
  }
}>

export default function FindPerson({onCreate,onAdd,config}:FindPersonProps) {
  const {token} = useSession()
  const [options, setOptions] = useState<AutocompleteOption<AggregatedPerson>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  // console.group('FindPerson')
  // console.log('options...',options)
  // console.log('status...', status)
  // console.groupEnd()

  async function searchContributor(searchFor: string) {
    setStatus({loading:true,foundFor:undefined})
    const resp = await searchForPerson({
      searchFor,
      token,
      // by default we include ORCID api in the search
      include_orcid: config?.include_orcid ?? true
    })
    // set options
    setOptions(resp)
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  function onAddPerson(selected:AutocompleteOption<AggregatedPerson>) {
    if (selected?.data) {
      // debugger
      onAdd(selected.data)
      // reset options
      if (config?.reset){
        setOptions([])
      }
      setStatus({
        loading: false,
        foundFor: undefined
      })
    }
  }

  function createContributor(newInputValue: string) {
    const name = splitName(newInputValue)
    // add new contributor
    onCreate({
      id: null,
      is_contact_person: false,
      email_address: null,
      affiliation: null,
      role: null,
      orcid: null,
      avatar_id: null,
      position: null,
      account: null,
      ...name
    })
    // reset options
    if (config?.reset){
      setOptions([])
    }
    setStatus({
      loading: false,
      foundFor: undefined
    })
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<AggregatedPerson>) {
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
    option: AutocompleteOption<AggregatedPerson>) {
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
      <li {...props} key={option.key}>
        <AggregatedPersonOption option={option} />
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchContributor}
        onAdd={onAddPerson}
        onCreate={createContributor}
        onRenderOption={renderOption}
        config={{
          freeSolo: true,
          forceShowAdd: true,
          // pass received config
          ...config
        }}
      />
    </section>
  )
}
