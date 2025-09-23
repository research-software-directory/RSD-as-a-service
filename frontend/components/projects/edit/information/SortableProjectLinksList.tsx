// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import SortableList from '~/components/layout/SortableList'
import {ProjectLink} from '~/types/Project'
import SortableProjectLinksItem from './SortableProjectLinkItem'

type SortableProjectLinksListProps = {
  links: ProjectLink[],
  onEdit: (pos: number) => void
  onDelete: (pos: number) => void
  onSorted: (link:ProjectLink[])=>void
}


export default function SortableProjectLinksList({links,onEdit,onDelete,onSorted}:SortableProjectLinksListProps) {

  function onRenderItem(item:ProjectLink,index:number) {
    return <SortableProjectLinksItem
      key={item.id ?? index}
      item={item}
      onEdit={()=>onEdit(index)}
      onDelete={()=>onDelete(index)}
    />
  }

  return (
    <SortableList
      items={links}
      onSorted={onSorted}
      onRenderItem={onRenderItem}
    />
  )
}
