// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import BlockIcon from '@mui/icons-material/Block'

import {EditOrganisation} from '~/types/Organisation'
import {getImageUrl} from '~/utils/editImage'
import SortableListItemActions from '~/components/layout/SortableListItemActions'
import SortableListItem from '~/components/layout/SortableListItem'

type OrganisationsListItemProps = Readonly<{
  organisation: EditOrganisation
  onEdit: ()=>void
  onDelete: ()=>void
  onCategory: ()=>void
}>

export default function SortableOrganisationsItem({organisation, onEdit, onDelete, onCategory}: OrganisationsListItemProps) {

  function getSecondaryActions() {
    if (organisation.status !== 'approved') {
      return (
        <div
          title={`Affiliation rejected by ${organisation.name}`}
        >
          <BlockIcon
            sx={{
              width: '4rem',
              height: '4rem',
              color: 'error.main',
              opacity:0.5
            }}
          />
        </div>
      )
    }
    return (
      <SortableListItemActions
        onDelete={onDelete}
        onCategory={onCategory}
        // if maintainer we show edit button
        onEdit={organisation.canEdit ? onEdit : undefined}
      />
    )
  }

  function getRSDLink() {
    if (organisation.rsd_path) {
      return `/organisations/${organisation.rsd_path}`
    }
    return `/organisations/${organisation.slug}`
  }

  return (
    <SortableListItem
      data-testid="organisation-list-item"
      item={organisation}
      key={organisation.id}
      secondaryAction={getSecondaryActions()}
      sx={{
        '&:hover': {
          backgroundColor:'grey.100'
        }
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={organisation.name ?? ''}
          src={getImageUrl(organisation.logo_id) ?? undefined}
          sx={{
            width: '6rem',
            height: '6rem',
            fontSize: '2rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {organisation.name.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        data-testid="organisation-list-item-text"
        primary={
          <a href={getRSDLink()} target="_blank">
            {organisation.name}
          </a>
        }
        secondary={
          <>
            <span>{organisation.website}</span>
            <br/>
            <span>{organisation.ror_id}</span>
          </>
        }
      />
    </SortableListItem>
  )
}
