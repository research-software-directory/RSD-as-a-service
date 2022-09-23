// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useEffect, useState} from 'react'

import AsyncAutocompleteSC, {
  AsyncAutocompleteConfig, AutocompleteOption
} from '~/components/form/AsyncAutocompleteSC'
import {MentionItemProps} from '~/types/Mention'
import {getMentionType} from './config'
import MentionItemBase from './MentionItemBase'

type FindMentionProps = {
  config: AsyncAutocompleteConfig
  searchFn: (title:string) => Promise<MentionItemProps[]>
  onAdd: (item: MentionItemProps) => void
  onCreate?: (keyword: string) => void
  onCancel?: () => void
}

let cancel = false

export default function FindMention({config, onAdd, searchFn, onCreate}: FindMentionProps) {
  const [state, setState] = useState<{
    options: AutocompleteOption<MentionItemProps>[]
    loading: boolean
    searchFor: string | undefined
    foundFor: string | undefined
  }>({
    options: [],
    loading: false,
    searchFor: undefined,
    foundFor: undefined
  })

  const {options,searchFor,foundFor,loading} = state

  // console.group('FindMention')
  // console.log('options...', options)
  // console.log('searchFor...', searchFor)
  // console.log('foundFor...', foundFor)
  // console.log('loading...', loading)
  // console.log('cancel...', cancel)
  // console.groupEnd()

  useEffect(() => {
    async function searchForItems() {
      setState({
        searchFor,
        foundFor,
        options: [],
        loading: true
      })
      if (!searchFor) return
      // make request
      // console.log('call searchFn for...', searchFor)
      const resp = await searchFn(searchFor)
      // console.log('cancel...', cancel)
      // debugger
      // if cancel is used we abort this function
      if (cancel) return
      const options = resp.map((item,pos) => ({
        key: pos.toString(),
        label: item.title ?? '',
        data: item
      }))
      // debugger
      setState({
        searchFor,
        options,
        loading: false,
        foundFor: searchFor
      })
    }
    if (searchFor &&
      searchFor !== foundFor &&
      loading === false &&
      cancel == false
    ) {
      // debugger
      searchForItems()
    }
  },[searchFor,foundFor,loading,searchFn])

  function onCancel() {
    // we reset state and set cancel on true
    // for any call to abort if in process (see useEffect)
    setState({
      options: [],
      loading: false,
      searchFor: undefined,
      foundFor: undefined
    })
    cancel = true
  }

  function onAddKeyword(selected:AutocompleteOption<MentionItemProps>) {
    if (selected && selected.data) {
      onAdd(selected.data)
    }
  }

  function createKeyword(newInputValue: string) {
    if (onCreate) onCreate(newInputValue)
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<MentionItemProps>) {
    // if onCreate fn is NOT provided
    // and freeSolo (free text) options is enabled
    // but there are no options to show
    // we change addOption to No options message
    // NOTE! the order of conditionals in this fn matters
    if (typeof onCreate == 'undefined' &&
      config.freeSolo === true &&
      options.length === 0) {
      // Return different element from li which is handled as options
      // while div is handles as message
      return <p key={option.key} className="px-4">{
        config.noOptions?.notFound ??
        'Hmmm...nothing found. Check spelling or try again later.'
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
    option: AutocompleteOption<MentionItemProps>,
    state: object) {
    // console.log('renderOption...', option)
    // when value is not not found option returns input prop
    if (option?.key==='__add_item__') {
      return renderAddOption(props,option)
    }
    return (
      <li {...props} key={option.key}>
        <MentionItemBase
          item={option.data}
          nav={
            // we show source on nav position
            <span className="pl-4 text-grey-600">{option.data.source}</span>
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
          cancel = false,
          setState({
            ...state,
            // remove options
            options: [],
            // pass searchterm
            searchFor,
          })
        }}
        onAdd={onAddKeyword}
        onCreate={createKeyword}
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
