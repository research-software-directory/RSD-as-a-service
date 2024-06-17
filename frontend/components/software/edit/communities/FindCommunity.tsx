// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'

import {useSession} from '~/auth'
import logger from '~/utils/logger'
import AsyncAutocompleteSC, {AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'
import {CommunityListProps, getCommunityList} from '~/components/communities/apiCommunities'
import {config} from './config'

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

  function createCommunity(newInputValue: string) {
    // onCreate(newInputValue)
    logger('create not support','warn')
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<CommunityListProps>) {
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
      <li
        data-testid="add-community-option"
        key={option.key}
        {...props}
      >
        {/* if new option (has input) show label and count  */}
        <strong>{`Add "${option.label}"`}</strong>
      </li>
    )
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<CommunityListProps>) {
    // when value is not found option returns input prop
    // if (option?.input) {
    //   // if input is over minLength
    //   if (option?.input.length > config.findCommunity.validation.minLength) {
    //     // we offer an option to create this entry
    //     return renderAddOption(props,option)
    //   } else {
    //     return null
    //   }
    // }
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
          minLength: config.findCommunity.validation.minLength,
          label: config.findCommunity.label,
          help: config.findCommunity.help,
          reset: true
        }}
      />
    </section>
  )
}
