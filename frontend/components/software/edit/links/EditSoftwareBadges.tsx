// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {config} from '~/components/software/edit/links/config'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import SortableList from '~/components/layout/SortableList'
import SortableListItem from '~/components/layout/SortableListItem'
import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {useFormContext} from 'react-hook-form'
import {BadgeForSoftware, EditSoftwareItem} from '~/types/SoftwareTypes'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LinkIcon from '@mui/icons-material/Link'
import {
  deleteBadge,
  getBadgesForSoftware,
  updateBadgePosition
} from '~/components/software/apiSoftware'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import Link from 'next/link'
import {useState} from 'react'
import EditSoftwareBadgeModal from '~/components/software/edit/links/EditSoftwareBadgeModal'
import AddButton from '~/components/layout/AddButton'

export default function EditSoftwareBadges() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {setValue, watch} = useFormContext<EditSoftwareItem>()

  const [modal, setModal] = useState<{
    open: boolean,
    data?: BadgeForSoftware
  }> ({
    open: false
  })

  const [softwareId, badges] = watch(['id', 'badges'])

  const urlsPresent = new Set<string>()
  badges.forEach(badge => urlsPresent.add(badge.badge_url))

  function openEditBadgeModal(badge?: BadgeForSoftware) {
    setModal({open: true, data: badge})
  }

  function handleNewBadgeAdded() {
    getBadgesForSoftware(softwareId, token)
      .then(updatedBadges => setValue('badges', updatedBadges))
      .catch(e => showErrorMessage(e.message))
      .finally(() => setModal({open: false}))
  }

  function handleSortedBadges(sortedBadges: BadgeForSoftware[]) {
    setValue('badges', sortedBadges)
    const promises = []
    for (const badge of sortedBadges) {
      promises.push(updateBadgePosition(token, badge.id, badge.position))
    }

    Promise.all(promises)
      .catch(e => showErrorMessage(e.message))
  }

  function handleDeleteBadge(badgeId: string) {
    deleteBadge(token, badgeId)
      .then(() => {
        const newBadgesArray = badges.filter(badge => badge.id !== badgeId)

        for (let i = 0; i < newBadgesArray.length; i++) {
          newBadgesArray[i].position = i + 1
        }

        handleSortedBadges(newBadgesArray)
      })
      .catch(e => showErrorMessage(e.message))
  }

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
        <AddButton onAdd={() => openEditBadgeModal()} />
      </EditSectionTitle>
      {modal.open && <EditSoftwareBadgeModal
        softwareId={softwareId}
        existingBadgeUrls={urlsPresent}
        onSave={() => handleNewBadgeAdded()}
        onCancel={() => setModal({open: false})}
        badgeToEdit={modal.data === undefined ? null : {
          badgeId: modal.data.id,
          badgeUrl: modal.data.badge_url,
          badgeLink: modal.data.link_url,
          altText: modal.data.alt_text,
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
