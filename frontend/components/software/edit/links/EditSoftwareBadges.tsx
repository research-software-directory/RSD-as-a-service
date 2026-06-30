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
import Button from '@mui/material/Button'
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
import Tooltip from '@mui/material/Tooltip'

export default function EditSoftwareBadges() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {setValue, watch} = useFormContext<EditSoftwareItem>()

  const [isAddBadgeModalOpen, setIsAddBadgeModalOpen] = useState<boolean>(false)
  const [badgeToEdit, setBadgeToEdit] = useState<BadgeForSoftware | null>(null)

  const softwareId = watch('id')
  const badges: BadgeForSoftware[] = watch('badges')

  const urlsPresent = new Set<string>()
  badges.forEach(badge => urlsPresent.add(badge.badge_url))

  function openEditBadgeModal(badge: BadgeForSoftware | null) {
    setBadgeToEdit(badge)
    setIsAddBadgeModalOpen(true)
  }

  function handleNewBadgeAdded() {
    getBadgesForSoftware(softwareId, token)
      .then(updatedBadges => setValue('badges', updatedBadges))
      .catch(e => showErrorMessage(e.message))
      .finally(() => setIsAddBadgeModalOpen(false))
  }

  function handleSortedBadges(sortedBadges: BadgeForSoftware[]) {
    setValue('badges', sortedBadges)
    const promises = []
    for (const badge of sortedBadges) {
      promises.push(updateBadgePosition(token, badge.id, badge.position))
    }

    Promise.allSettled(promises)
      .catch(e => showErrorMessage(e.message))
  }

  function handleDeleteBadge(badgeId: string) {
    deleteBadge(token, badgeId)
      .then(() => {
        const deletedBadgeIndex = badges.findIndex(badge => badge.id === badgeId)
        const newBadgesArray = badges.toSpliced(deletedBadgeIndex, 1)

        for (let i = 0; i < newBadgesArray.length; i++) {
          newBadgesArray[i].position = i + 1
        }

        handleSortedBadges(newBadgesArray)
      })
      .catch(e => showErrorMessage(e.message))
  }

  function renderBadge(badge: BadgeForSoftware) {
    const badgeContent = <img src={badge.badge_url} alt={badge.badge_url} className="max-h-[20px]" />

    const secondaryAction = (
      <>
        {badge.link_url && <Tooltip placement="top" title={`Go to ${badge.link_url}`}><IconButton LinkComponent={Link} href={badge.link_url}><LinkIcon /></IconButton></Tooltip>}
        <Tooltip placement="top" title="Edit badge"><IconButton onClick={() => {openEditBadgeModal(badge)}}><EditIcon /></IconButton></Tooltip>
        <Tooltip placement="top" title="Delete badge"><IconButton onClick={() => handleDeleteBadge(badge.id)}><DeleteIcon /></IconButton></Tooltip>
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
        <Button
          variant='contained'
          onClick={() => openEditBadgeModal(null)}>
          Add badge
        </Button>
      </EditSectionTitle>
      {isAddBadgeModalOpen && <EditSoftwareBadgeModal
        softwareId={softwareId}
        existingBadgeUrls={urlsPresent}
        onSave={() => handleNewBadgeAdded()}
        onCancel={() => setIsAddBadgeModalOpen(false)}
        badgeToEdit={badgeToEdit === null ? null : {badgeId: badgeToEdit.id, badgeUrl: badgeToEdit.badge_url, badgeLink: badgeToEdit.link_url}}
      />}
      <SortableList
        items={badges}
        onSorted={(sortedBadges) => handleSortedBadges(sortedBadges)}
        onRenderItem={renderBadge}
      />
    </>
  )
}
