// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import SelectedFilterItems from '~/components/filter/SelectedFilterItems'
import FindFilterOptions from '~/components/filter/FindFilterOptions'
import {ResearchDomain} from './projectFilterApi'

type SeachApiProps = {
  searchFor: string
}

type ResearchDomainFilter = {
  items?: ResearchDomain[]
  onApply: (items: ResearchDomain[]) => void
  searchApi: ({searchFor}:SeachApiProps)=> Promise<ResearchDomain[]>
}

export function getDomainLabels(domains: ResearchDomain[]) {
  const labels = domains.map(item => `${item.key}: ${item.name}`)
  return labels
}

/**
 * Research domain filter component. It receives array of research domain item and returns
 * array of selected keys to use in the filter using onApply
 */
export default function ResearchDomainFilter({items=[], searchApi, onApply}:ResearchDomainFilter) {
  // convert items to filter labels
  const selected = getDomainLabels(items)

  function handleDelete(pos:number) {
    const newList = [
      ...items.slice(0, pos),
      ...items.slice(pos+1)
    ]
    // apply change
    onApply(newList)
  }

  function onAdd(item: ResearchDomain) {
    const find = items.find(selected => selected.key.toLowerCase() === item.key.toLowerCase())
    // new item
    if (typeof find == 'undefined') {
      const newList = [
        ...items,
        item
      ].sort()
      // apply change
      onApply(newList)
    }
  }

  function itemsToOptions(items:ResearchDomain[]) {
    const options = items.map(item => ({
      key: item.key,
      label: `${item.key}: ${item.name}`,
      data: item
    }))
    return options
  }

  return (
    <>
      <div className="px-4 py-4">
        <h4 className="mb-2">By research domain</h4>
        <FindFilterOptions
          config={{
            freeSolo: false,
            minLength: 0,
            label: 'Select or type a research domain',
            help: '',
            reset: true,
            noOptions: {
              empty: 'Type research domain',
              minLength: 'Too short',
              notFound: 'There are no projects with this research domain'
            }
          }}
          searchApi={searchApi}
          onAdd={onAdd}
          itemsToOptions={itemsToOptions}
        />
      </div>
      <SelectedFilterItems
        items={selected}
        onDelete={handleDelete}
      />
    </>
  )
}
