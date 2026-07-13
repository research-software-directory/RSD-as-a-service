// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'

import {BadgeForSoftware} from '~/types/SoftwareTypes'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import SortableList from '~/components/layout/SortableList'
import AddButton from '~/components/layout/AddButton'
import SortableListItem from '~/components/layout/SortableListItem'
import EditSoftwareBadgeModal from '~/components/software/edit/links/EditSoftwareBadgeModal'
import {config} from '~/components/software/edit/links/config'
import {useEditSoftwareBadges} from './useEditSoftwareBadges'

export default function EditSoftwareBadges() {
  const {
    badges,urlsPresent,modal,
    openEditBadgeModal,closeEditBadgeModal,
    handleOnSaveBadge, handleDeleteBadge,
    handleSortedBadges
  } = useEditSoftwareBadges()

  function renderBadge(badge: BadgeForSoftware) {
    const badgeContent = <img src={badge.badge_url} alt={badge.alt_text ?? ''} className="max-h-[20px]" />

    const secondaryAction = (
      <>
        {badge.link_url &&
          <IconButton LinkComponent={Link} href={badge.link_url} target="_blank" rel="noreferrer">
            <LinkIcon />
          </IconButton>}
        <IconButton onClick={() => {openEditBadgeModal(badge)}} title="Edit badge">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteBadge(badge.id)} title="Delete badge">
          <DeleteIcon />
        </IconButton>
      </>
    )

    return (
      <SortableListItem
        item={badge}
        key={badge.id}
        secondaryAction={secondaryAction}
      >
        <ListItemText>
          {badgeContent}
        </ListItemText>
      </SortableListItem>
    )
  }

  return (
    <>
      <EditSectionTitle
        title={config.badges.title}
        subtitle={config.badges.subtitle}
      >
        <AddButton onAdd={openEditBadgeModal} />
      </EditSectionTitle>
      {modal.open && <EditSoftwareBadgeModal
        existingBadgeUrls={urlsPresent}
        onSave={handleOnSaveBadge}
        onCancel={closeEditBadgeModal}
        badgeToEdit={{
          badgeId: modal?.data?.id ?? null,
          badgeUrl: modal?.data?.badge_url ?? null,
          altText: modal?.data?.alt_text ?? null,
          badgeLink: modal?.data?.link_url ?? null
        }}
      />}
      <SortableList
        items={badges}
        onSorted={handleSortedBadges}
        onRenderItem={renderBadge}
      />
    </>
  )
}
