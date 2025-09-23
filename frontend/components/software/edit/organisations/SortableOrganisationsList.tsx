// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import SortableList from '~/components/layout/SortableList'
import {EditOrganisation} from '~/types/Organisation'
import SortableOrganisationItem from './SortableOrganisationItem'

type OrganisationListProps = {
  organisations: EditOrganisation[]
  onEdit: (pos: number) => void
  onDelete: (pos: number) => void
  onSorted: (organisation:EditOrganisation[])=>void
  onCategory: (pos: number) => void
}

export default function SortableOrganisationsList({organisations,onEdit,onDelete,onSorted,onCategory}:OrganisationListProps) {

  if (organisations.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No participating organisations</AlertTitle>
        Add organisation using <strong>search form!</strong>
      </Alert>
    )
  }

  function onRenderItem(item:EditOrganisation,index:number) {
    return <SortableOrganisationItem
      key={item.id ?? index}
      organisation={item}
      onEdit={()=>onEdit(index)}
      onDelete={()=>onDelete(index)}
      onCategory={()=>onCategory(index)}
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
