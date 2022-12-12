// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {Keyword} from '~/components/keyword/FindKeyword'
import FindFilterOptions from '~/components/filter/FindFilterOptions'
import SelectedFilterItems from '~/components/filter/SelectedFilterItems'

type SeachApiProps = {
  searchFor: string
}

export type KeywordFilterProps = {
  items: string[]
  onApply: (items: string[]) => void
  searchApi: ({searchFor}:SeachApiProps)=> Promise<Keyword[]>
}

/**
 * Keywords filter component. It receives array of keywords and returns
 * array of selected tags to use in filter using onSelect callback function
 */
export default function KeywordFilter({items=[], searchApi, onApply}:KeywordFilterProps) {

  function handleDelete(pos:number) {
    const newList = [
      ...items.slice(0, pos),
      ...items.slice(pos+1)
    ]
    // apply change
    onApply(newList)
  }

  function onAdd(item: Keyword) {
    const find = items.find(keyword => keyword.toLowerCase() === item.keyword.toLowerCase())
    // new item
    if (typeof find == 'undefined') {
      const newList = [
        ...items,
        item.keyword
      ].sort()
      // apply change
      onApply(newList)
    }
  }

  function itemsToOptions(items: Keyword[]) {
    const options = items.map(item => ({
      key: item.keyword,
      label: item.keyword,
      data: item
    }))
    return options
  }

  return (
    <>
      <div className="px-4 py-4">
        <h4 className="mb-2">By keyword</h4>
        <FindFilterOptions
          config={{
            freeSolo: false,
            minLength: 0,
            label: 'Select or type a keyword',
            help: '',
            reset: true,
            noOptions: {
              empty: 'Type keyword',
              minLength: 'Too short',
              notFound: 'There are no projects with this keyword'
            }
          }}
          searchApi={searchApi}
          onAdd={onAdd}
          itemsToOptions={itemsToOptions}
        />
      </div>
      <SelectedFilterItems
        items={items}
        onDelete={handleDelete}
      />
    </>
  )
}
