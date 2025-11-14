// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import SortableListItem from '~/components/layout/SortableListItem'
import RepositoryItemContent from '~/components/admin/repositories/RepositoryItemContent'
import {RepositoryForSoftware} from './apiRepositories'

export type SoftwareRepositoryListItemProps = {
  pos: number,
  item: RepositoryForSoftware
  // onEdit:(pos:number)=>void,
  onDelete:(pos:number)=>void,
}
export default function SoftwareRepositoryListItem({pos,item,onDelete}:SoftwareRepositoryListItemProps){

  return (
    <SortableListItem
      data-testid="software-repository-list-item"
      key={item.id}
      pos={pos}
      item={item}
      // no edit option
      // onEdit={onEdit}
      onDelete={onDelete}
      sx={{
        '&:hover': {
          backgroundColor:'grey.100'
        },
      }}
    >
      <RepositoryItemContent item={item}/>
    </SortableListItem>
  )
}
