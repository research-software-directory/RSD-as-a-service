// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import {TeamMember} from '~/types/Project'
import SortableList from '~/components/layout/SortableList'
import SortableTeamMemberItem from './SortableTeamMemberItem'

type TeamMemberListProps = {
	members: TeamMember[],
	onEdit: (member: TeamMember, pos: number) => void
  onDelete: (pos: number) => void
  onSorted: (members:TeamMember[])=>void
}


export default function SortableTeamMemberList({members, onEdit, onDelete, onSorted}: TeamMemberListProps) {
	// show message when no members
	if (members.length === 0) {
		return (
      <Alert
        data-testid="no-team-member-alert"
        severity="warning" sx={{marginTop: '0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No team members</AlertTitle>
        Add team member using the <strong>search form!</strong>
		  </Alert>
		)
	}

  function onEditMember(pos: number) {
    const member = members[pos]
    onEdit(member,pos)
  }

  function onRenderItem(item:TeamMember,index?:number) {
    return <SortableTeamMemberItem
      key={item.id ?? index}
      pos={index ?? 0}
      item={item}
      onEdit={onEditMember}
      onDelete={onDelete}
    />
  }

  return (
    <SortableList
      items={members}
      onSorted={onSorted}
      onRenderItem={onRenderItem}
    />
  )
}
