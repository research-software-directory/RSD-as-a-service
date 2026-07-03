// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
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
import {useEditSoftwareBadges} from './useEditSoftwareBadges'

export default function EditSoftwareBadges() {
  const {
    softwareId, badges, urlsPresent, modal,
    openEditBadgeModal, closeEditBadgeModal,
    handleOnSaveBadge, handleSortedBadges,
    handleDeleteBadge
  } = useEditSoftwareBadges()
  // const {token} = useSession()
  // const {showErrorMessage} = useSnackbar()
  // const {setValue, watch} = useFormContext<EditSoftwareItem>()

  // // const [isAddBadgeModalOpen, setIsAddBadgeModalOpen] = useState<boolean>(false)
  // // const [badgeToEdit, setBadgeToEdit] = useState<BadgeForSoftware>()
  // const [modal, setModal] = useState<{
  //   open: boolean,
  //   data?: BadgeForSoftware
  // }>({
  //   open: false
  // })

  // const softwareId = watch('id')
  // const badges: BadgeForSoftware[] = watch('badges')
  // const [softwareId, badges] = watch(['id','badges'])

  // why this line and why set instead of array
  // const urlsPresent = new Set<string>()
  // badges.forEach(badge => urlsPresent.add(badge.badge_url))

  // function openEditBadgeModal(badge?: BadgeForSoftware) {
  //   // setBadgeToEdit(badge)
  //   // setIsAddBadgeModalOpen(true)
  //   setModal({
  //     open:true,
  //     data: badge
  //   })
  // }

  // function handleNewBadgeAdded() {
  //   getBadgesForSoftware(softwareId, token)
  //     .then(updatedBadges => setValue('badges', updatedBadges))
  //     .catch(e => showErrorMessage(e.message))
  //     .finally(() => setModal({open:false}))
  // }

  // function handleSortedBadges(sortedBadges: BadgeForSoftware[]) {
  //   setValue('badges', sortedBadges)
  //   const promises = []
  //   for (const badge of sortedBadges) {
  //     promises.push(updateBadgePosition(token, badge.id, badge.position))
  //   }

  //   Promise.allSettled(promises)
  //     .catch(e => showErrorMessage(e.message))
  // }

  // function handleDeleteBadge(badgeId: string) {
  //   deleteBadge(token, badgeId)
  //     .then(() => {
  //       const deletedBadgeIndex = badges.findIndex(badge => badge.id === badgeId)
  //       const newBadgesArray = badges.toSpliced(deletedBadgeIndex, 1)

  //       for (let i = 0; i < newBadgesArray.length; i++) {
  //         newBadgesArray[i].position = i + 1
  //       }

  //       handleSortedBadges(newBadgesArray)
  //     })
  //     .catch(e => showErrorMessage(e.message))
  // }

  function renderBadge(badge: BadgeForSoftware) {
    const badgeContent = <img src={badge.badge_url} alt="Software badge" className="max-h-[1.5rem]" />

    const secondaryAction = (
      <>
        {badge.link_url &&
        // added open link in new tab
          <IconButton LinkComponent={Link} href={badge.link_url} target='_blank' title={`Go to ${badge.link_url}`}>
            <LinkIcon />
          </IconButton>
        }
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
        <Button
          variant='contained'
          onClick={()=>openEditBadgeModal()}>
          Add badge
        </Button>
      </EditSectionTitle>
      {modal.open ? <EditSoftwareBadgeModal
        softwareId={softwareId}
        existingBadgeUrls={urlsPresent}
        onSave={handleOnSaveBadge}
        onCancel={closeEditBadgeModal}
        badgeToEdit={modal.data}
      />:null}
      <SortableList
        items={badges}
        onSorted={handleSortedBadges}
        onRenderItem={renderBadge}
      />
    </>
  )
}
