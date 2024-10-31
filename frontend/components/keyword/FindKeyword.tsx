// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useEffect, useState} from 'react'

import AsyncAutocompleteSC, {AsyncAutocompleteConfig, AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'

export type Keyword = {
  id: string,
  keyword: string,
  cnt: number | null
}

type FindKeywordProps = {
  config: AsyncAutocompleteConfig
  searchForKeyword: ({searchFor}: {searchFor: string}) => Promise<Keyword[]>
  onAdd: (item: Keyword) => void
  onCreate?: (keyword: string) => void
}

export default function FindKeyword({config, onAdd, searchForKeyword, onCreate}: FindKeywordProps) {
  const [initalList, setInitalList] = useState<AutocompleteOption<Keyword>[]>([])
  const [options, setOptions] = useState<AutocompleteOption<Keyword>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    searchFor: string | undefined
    foundFor: string | undefined
  }>({
    loading: false,
    searchFor: undefined,
    foundFor: undefined
  })

  useEffect(() => {
    async function getInitalList() {
      const resp = await searchForKeyword({
        // we trim raw search value
        searchFor: ''
      })
      // convert keywords to autocomplete options
      const options = resp.map(item => ({
        key: item.keyword,
        label: item.keyword,
        data: item
      }))
      // debugger
      // set options
      setOptions(options)
      setInitalList(options)
    }
    getInitalList()
  // ignore linter for searchForKeyword fn
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function searchKeyword(searchFor: string) {
    // console.log('searchKeyword...searchFor...', searchFor)
    // set loading status and clear foundFor
    setStatus({loading: true, searchFor, foundFor: undefined})
    // make search request
    const resp = await searchForKeyword({
      // we trim raw search value
      searchFor: searchFor.trim()
    })
    // console.log('searchKeyword...resp...', resp)
    // convert keywords to autocomplete options
    const options = resp.map(item => ({
      key: item.keyword,
      label: item.keyword,
      data: item
    }))
    // set options
    setOptions(options)
    // debugger
    // stop loading
    setStatus({
      loading: false,
      searchFor,
      foundFor: searchFor
    })
  }

  function onAddKeyword(selected:AutocompleteOption<Keyword>) {
    if (selected && selected.data) {
      onAdd(selected.data)
      // if we use reset of selected input
      // we also load inital list of keywords
      if (config.reset === true) {
        setOptions(initalList)
      }
    }
  }

  function createKeyword(newInputValue: string) {
    if (onCreate) onCreate(newInputValue)
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<Keyword>) {
    // if more than one option we add border at the bottom
    // we assume that first option is Add "new item"
    if (options.length > 1 && onCreate) {
      if (props?.className) {
        props.className+=' mb-2 border-b'
      } else {
        props.className='mb-2 border-b'
      }
    }
    return (
      <li {...props} key={option.key}>
        {/* if new option (has input) show label and count  */}
        <strong>{`Add "${option.label.trim()}"`}</strong>
      </li>
    )
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<Keyword>
  ) {
    // console.log('renderOption...', option)
    // when value is not not found option returns input prop
    if (option?.input && onCreate) {
      // if input is over minLength
      if (option?.input.trim().length > config.minLength) {
        // we offer an option to create this entry
        return renderAddOption(props,option)
      } else {
        return null
      }
    }
    return (
      <li
        data-testid="find-keyword-item"
        {...props}
        key={option.key}>
        {/* if new option (has input) show label and count  */}
        {option.label} ({option.data.cnt ?? 0})
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchKeyword}
        onAdd={onAddKeyword}
        onCreate={createKeyword}
        onRenderOption={renderOption}
        onClear={()=>setOptions(initalList)}
        config={{
          ...config,
          // freeSolo allows create option
          // if onCreate fn is not provided
          // we do not allow free solo text
          // eg. only selection of found items
          freeSolo: onCreate ? true : false
        }}
      />
    </section>
  )
}
