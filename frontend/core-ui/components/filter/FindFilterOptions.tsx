// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useEffect, useState} from 'react'

import AsyncAutocompleteSC, {
  AsyncAutocompleteConfig, AutocompleteOption
} from '~/components/form/AsyncAutocompleteSC'

type RequiredData = {
  cnt: number|null
}

type FindFilterOptionsProps<T> = {
  config: AsyncAutocompleteConfig
  searchApi: ({searchFor}: {searchFor: string}) => Promise<T[]>
  onAdd: (item: T) => void
  itemsToOptions: (items:T[]) => AutocompleteOption<T>[]
  // onCreate?: (item: string) => void
}

export default function FindFilterOptions<T extends RequiredData>({
  config, onAdd, searchApi, itemsToOptions}: FindFilterOptionsProps<T>) {
  const [initalList, setInitalList] = useState<AutocompleteOption<T>[]>([])
  const [options, setOptions] = useState<AutocompleteOption<T>[]>([])
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
      const resp = await searchApi({
        // we trim raw search value
        searchFor: ''
      })
      // convert items to autocomplete options
      const options = itemsToOptions(resp)
      // set options
      setOptions(options)
      setInitalList(options)
    }
    getInitalList()
  // ignore linter for searchForKeyword fn
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSearch(searchFor: string) {
    // console.log('onSearch...searchFor...', searchFor)
    // set loading status and clear foundFor
    setStatus({loading: true, searchFor, foundFor: undefined})
    // make search request
    const resp = await searchApi({
      // we trim raw search value
      searchFor: searchFor.trim()
    })
    // convert items to autocomplete options
    const options = itemsToOptions(resp)
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

  function onAddItem(selected:AutocompleteOption<T>) {
    if (selected && selected.data) {
      onAdd(selected.data)
      // if we use reset of selected input
      // we also load inital list of keywords
      if (config.reset === true) {
        setOptions(initalList)
      }
    }
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<T>,
    state: object) {

    return (
      <li {...props} key={option.key}>
        {/* if new option (has input) show label and count  */}
        <div>
          {option.label}
          <span className="text-base-content-disabled align-top ml-2">
            ({option.data?.cnt ?? 0})
          </span>
        </div>
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={onSearch}
        onAdd={onAddItem}
        // onCreate={createKeyword}
        onRenderOption={renderOption}
        onClear={()=>setOptions(initalList)}
        config={config}
      />
    </section>
  )
}
