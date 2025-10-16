// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {RsdLink} from '~/config/rsdSettingsReducer'
import {useFormContext} from 'react-hook-form'

import {app} from '~/config/app'
import SortableList from '~/components/layout/SortableList'
import SortableNavItem from './SortableNavItem'
import useOnUnsaveChange from '~/utils/useOnUnsavedChange'

export type PagesNavProps = {
  links: RsdLink[]
  selected: string,
  onSelect: (item: RsdLink) => void
  onSorted:(items:RsdLink[])=>void
}

export default function SortableNav({selected, links, onSelect, onSorted}: PagesNavProps) {
  const {formState: {isDirty}} = useFormContext()

  // watch for unsaved changes
  useOnUnsaveChange({
    isDirty,
    warning: app.unsavedChangesMessage
  })

  function onNavigation(item: RsdLink) {
    if (isDirty === false) {
      onSelect(item)
    } else {
      const leavePage = confirm(app.unsavedChangesMessage)
      if (leavePage === true) {
        onSelect(item)
      }
    }
  }

  /**
   * This method is called by SortableList component to enable
   * rendering of custom sortable items
   * @param item
   * @param index
   * @returns React.JSX.Element
   */
  function renderListItem(item: RsdLink, index: number) {
    return (
      <SortableNavItem
        key={item.id}
        item={item}
        index={index}
        selected={selected}
        onSelect={onNavigation}
      />
    )
  }

  // console.group('SortableNav')
  // console.log('selected...', selected)
  // console.log('links...', links)
  // console.log('isDirty...', isDirty)
  // console.groupEnd()

  return (
    <SortableList
      items={links}
      onSorted={onSorted}
      onRenderItem={renderListItem}
    />
  )
}
