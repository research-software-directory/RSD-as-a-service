// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import {Contributor} from '~/types/Contributor'
import SortableList from '~/components/layout/SortableList'
import SortableContributorItem from './SortableContributorItem'

type SortableContributorsListProps = {
	contributors: Contributor[],
	onEdit: (pos: number) => void
  onDelete: (pos: number) => void
  onSorted: (members:Contributor[])=>void
}

export default function SortableContributorsList({contributors, onEdit, onDelete, onSorted}:SortableContributorsListProps) {

  if (contributors.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No contributors</AlertTitle>
        Add contributors using <strong>search form!</strong>
      </Alert>
    )
  }

  function onRenderItem(item:Contributor,index?:number) {
    return <SortableContributorItem
      key={item.id ?? index}
      pos={index ?? 0}
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  }

  return (
    <SortableList
      items={contributors}
      onSorted={onSorted}
      onRenderItem={onRenderItem}
    />
  )
}
