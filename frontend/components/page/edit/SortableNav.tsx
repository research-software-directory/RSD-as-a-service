// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {RsdLink} from '~/config/rsdSettingsReducer'
import SortableList from '~/components/layout/SortableList'
import PageNavItem from './SortableNavItem'

type PagesNavProps = {
  links: RsdLink[]
  selected: string,
  onSelect: (item: RsdLink) => void
  onSorted:(items:RsdLink[])=>void
}

export default function SortableNav({selected, links, onSelect, onSorted}: PagesNavProps) {

  /**
   * This method is called by SortableList component to enable
   * rendering of custom sortable items
   * @param item
   * @param index
   * @returns JSX.Element
   */
  function renderListItem(item: RsdLink, index?: number) {
    return (
       <PageNavItem
        key={item.id}
        item={item}
        index={index ?? 1}
        selected={selected}
        onSelect={onSelect}
      />
    )
  }

  // console.group('PagesNav')
  // console.log('selected...', selected)
  // console.log('links...', links)
  // console.groupEnd()

  return (
    <SortableList
      items={links}
      onSorted={onSorted}
      onRenderItem={renderListItem}
    />
  )
}
