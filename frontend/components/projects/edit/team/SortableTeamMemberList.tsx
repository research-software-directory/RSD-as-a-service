// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Alert, AlertTitle} from '@mui/material'

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
		  <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No team members</AlertTitle>
        Add team member using <strong>search form!</strong>
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
