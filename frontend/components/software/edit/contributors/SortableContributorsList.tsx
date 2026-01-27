// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
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
      <Alert
        data-testid="no-contributor-alert"
        severity="warning" sx={{marginTop: '0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No contributors</AlertTitle>
        Add contributors using the <strong>search form!</strong>
      </Alert>
    )
  }

  function onRenderItem(item:Contributor,index:number) {
    return <SortableContributorItem
      key={item.id ?? index}
      item={item}
      onEdit={()=>onEdit(index)}
      onDelete={()=>onDelete(index)}
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
