// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import SelectedFilterItems from '~/components/filter/SelectedFilterItems'
import FindFilterOptions from '~/components/filter/FindFilterOptions'
import {ProgramminLanguage} from './softwareFilterApi'


type SeachApiProps = {
  searchFor: string
}

type ResearchDomainFilterProps = {
  items?: string[]
  onApply: (items: string[]) => void
  searchApi: ({searchFor}:SeachApiProps)=> Promise<ProgramminLanguage[]>
}

export default function ProgrammingLanguageFilter({items=[], searchApi, onApply}:ResearchDomainFilterProps) {

  function handleDelete(pos:number) {
    const newList = [
      ...items.slice(0, pos),
      ...items.slice(pos+1)
    ]
    // apply change
    onApply(newList)
  }

  function onAdd(item: ProgramminLanguage) {
    const find = items.find(lang => lang.toLowerCase() === item.prog_lang.toLowerCase())
    // new item
    if (typeof find == 'undefined') {
      const newList = [
        ...items,
        item.prog_lang
      ].sort()
      // apply change
      onApply(newList)
    }
  }

  function itemsToOptions(items: ProgramminLanguage[]) {
    const options = items.map(item => ({
      key: item.prog_lang,
      label: item.prog_lang,
      data: item
    }))
    return options
  }

  return (
    <>
      <div className="px-4 py-4">
        <h4 className="mb-2">By programming language</h4>
        <FindFilterOptions
          config={{
            freeSolo: false,
            minLength: 0,
            label: 'Select or type a programming language',
            help: '',
            reset: true,
            noOptions: {
              empty: 'Type programmin language',
              minLength: 'Too short',
              notFound: 'There are no items found'
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
