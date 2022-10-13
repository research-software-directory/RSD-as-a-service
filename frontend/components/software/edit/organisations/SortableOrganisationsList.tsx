// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Alert, AlertTitle} from '@mui/material'
import SortableList from '~/components/layout/SortableList'
import {EditOrganisation} from '../../../../types/Organisation'
import SortableOrganisationItem from './SortableOrganisationItem'

type OrganisationListProps = {
  organisations: EditOrganisation[]
  onEdit: (pos: number) => void
  onDelete: (pos: number) => void
  onSorted: (organisation:EditOrganisation[])=>void
}


export default function SortableOrganisationsList({organisations,onEdit,onDelete,onSorted}:OrganisationListProps) {

  if (organisations.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No participating organisations</AlertTitle>
        Add organisation using <strong>search form!</strong>
      </Alert>
    )
  }

  function onRenderItem(item:EditOrganisation,index?:number) {
    return <SortableOrganisationItem
      key={item.id ?? index}
      pos={index ?? 0}
      organisation={item}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  }

  return (
    <SortableList
      items={organisations}
      onSorted={onSorted}
      onRenderItem={onRenderItem}
    />
  )
}
