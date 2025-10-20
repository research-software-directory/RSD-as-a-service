// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {HTMLAttributes, useEffect, useState} from 'react'

import AsyncAutocompleteSC, {
  AsyncAutocompleteConfig, AutocompleteOption
} from '~/components/form/AsyncAutocompleteSC'
import {MentionItemProps} from '~/types/Mention'
import {getMentionType} from './config'
import MentionItemBase from './MentionItemBase'

export type FindMentionProps = {
  config: AsyncAutocompleteConfig
  searchFn: (title:string) => Promise<MentionItemProps[]>
  onAdd: (item: MentionItemProps) => void
  onCreate?: (keyword: string) => void
}

type FindMentionState = {
  options: AutocompleteOption<MentionItemProps>[]
  loading: boolean
  searchFor: string | undefined
  foundFor: string | undefined
}

// Use global variable processing
// to return options of the last processing request
let processing = ''

export default function FindMention({config, onAdd, searchFn, onCreate}: FindMentionProps) {
  const [state, setState] = useState<FindMentionState>({
    options: [],
    loading: false,
    searchFor: undefined,
    foundFor: undefined
  })

  const {options, searchFor, foundFor, loading} = state

  // console.group('FindMention')
  // console.log('searchFor...', searchFor)
  // console.log('foundFor...', foundFor)
  // console.log('processing...', processing)
  // console.log('loading...', loading)
  // console.log('options...', options)
  // console.groupEnd()

  useEffect(() => {
    // because we use global variable
    // we need to reset value on each component load
    // otherwise the value is memorized and the last
    // processing value will be present.
    processing=''
  },[])

  useEffect(() => {
    async function searchForItems() {
      if (typeof searchFor == 'undefined') return
      if (searchFor === foundFor) return
      if (searchFor === processing) return
      // flag start of the process
      processing = searchFor
      setState({
        searchFor,
        foundFor,
        options: [],
        loading: true
      })
      // make request
      const resp = await searchFn(searchFor)
      // prepare options
      const options = resp.map((item,pos) => ({
        key: pos.toString(),
        label: item.title ?? '',
        data: item
      }))
      // ONLY if the response concerns the processing term.
      // processing is a "global" variable and keeps track of
      // the most recent request, previous request are ignored.
      // This logic is needed because we allow user to change
      // search term during the api request.
      if (searchFor === processing) {
        // console.group('FindMention.searchForItems.UseResponse')
        // console.log('searchFor...', searchFor)
        // console.log('foundFor...', foundFor)
        // console.log('processing...', processing)
        // console.log('loading...', loading)
        // console.log('options...', options)
        // console.groupEnd()
        // debugger
        setState({
          searchFor,
          options,
          loading: false,
          foundFor: searchFor
        })
      }
    }
    // call search function
    if (searchFor) searchForItems()
  // Note! we ignore searchFn in dependency array because it's not memoized
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchFor,foundFor])

  function onCancel() {
    // remove processing value to avoid state update
    // see useEffect line 88
    processing = ''
    // clear options and loading state
    setState({
      options: [],
      loading: false,
      searchFor: undefined,
      foundFor: undefined
    })
  }

  function onAddMention(selected: AutocompleteOption<MentionItemProps>) {
    if (selected && selected.data) {
      onAdd(selected.data)
      if (config.reset === true) {
        // clear everything
        onCancel()
      }
    }
  }

  function createMention(newInputValue: string) {
    if (onCreate) onCreate(newInputValue)
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<MentionItemProps>) {
    // if onCreate fn is NOT provided
    // and freeSolo (free text) options is enabled
    // but there are no options to show
    // we change addOption to No options message
    // NOTE! the order of conditionals matters
    if (typeof onCreate == 'undefined' &&
      config.freeSolo === true &&
      options.length === 0) {
      // Return different element from li which is handled as option
      // while p or div element is handled as message
      return <p key={option.key} className="px-4">{
        config.noOptions?.notFound ??
        'Hmm... nothing found. Check the spelling or maybe try later.'
      }</p>
    }
    // ignore add option if minLength not met or
    // onCreate fn is not provided
    if (option?.label.length < config.minLength ||
      typeof onCreate == 'undefined') {
      // console.log('renderAddOption...options...', options)
      return null
    }
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
    option: AutocompleteOption<MentionItemProps>
  ) {
    // console.log('renderOption...', option)
    // when value is not not found option returns input prop
    if (option?.key==='__add_item__') {
      return renderAddOption(props,option)
    }
    return (
      <li
        data-testid="find-mention-option"
        {...props}
        key={option.key}
      >
        <MentionItemBase
          item={option.data}
          nav={
            // we show source on nav position
            <span className="pl-4 text-base-600">{option.data.source}</span>
          }
          type={getMentionType(option.data.mention_type, 'singular')}
          role="find"
        />
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocompleteSC
        status={{
          loading,
          foundFor
        }}
        options={options}
        onSearch={(searchFor) => {
          setState({
            ...state,
            // remove options
            options: [],
            // pass searchterm
            searchFor,
          })
        }}
        onAdd={onAddMention}
        onCreate={createMention}
        onRenderOption={renderOption}
        config={{
          ...config,
          clearText: loading ? 'Cancel' : 'Clear'
        }}
        onClear={onCancel}
      />
    </section>
  )
}
