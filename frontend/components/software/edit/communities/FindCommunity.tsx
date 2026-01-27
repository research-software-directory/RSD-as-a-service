// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import AsyncAutocompleteSC, {AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'
import {CommunityListProps, getCommunityList} from '~/components/communities/apiCommunities'
import {cfg} from './config'

type FindCommunityProps={
  readonly onAdd: (item: CommunityListProps) => void,
}

export default function FindCommunity({onAdd}:FindCommunityProps) {
  const {token} = useSession()
  const [options, setOptions] = useState<AutocompleteOption<CommunityListProps>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchCommunity(searchFor: string) {
    setStatus({loading:true,foundFor:undefined})
    const {communities} = await getCommunityList({
      page: 0,
      rows: 100,
      searchFor,
      token
    })
    const options = communities.map(item=>{
      return {
        key: item.id,
        label: item.name,
        data: item
      }
    })
    // set options
    setOptions(options ?? [])
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  function clearSearch() {
    // reset
    setStatus({
      loading: false,
      foundFor: undefined
    })
    setOptions([])
  }

  function onAddCommunity(selected:AutocompleteOption<CommunityListProps>) {
    if (selected && selected.data) {
      onAdd({
        ...selected.data
      })
      // reset
      clearSearch()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function createCommunity(newInputValue: string) {
    // onCreate(newInputValue)
    logger('create not supported','warn')
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<CommunityListProps>
  ) {

    return (
      <li
        data-testid="find-community-option"
        {...props}
        // overwrite props.key
        key={option.key}
      >
        {/* <FindOrganisationItem {...option.data} /> */}
        <div className="flex flex-col">
          <div className="">{option.label}</div>
          <div className="text-base-content-secondary text-sm">
            {option.data.short_description}
          </div>
          {/* <div className="text-base-600 text-sm">
            {option.data.keywords?.join(' ')}
          </div> */}
        </div>
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchCommunity}
        onAdd={onAddCommunity}
        onCreate={createCommunity}
        onRenderOption={renderOption}
        onClear={clearSearch}
        config={{
          freeSolo: false,
          minLength: cfg.findCommunity.validation.minLength,
          label: cfg.findCommunity.label,
          help: cfg.findCommunity.help,
          reset: true
        }}
      />
    </section>
  )
}
