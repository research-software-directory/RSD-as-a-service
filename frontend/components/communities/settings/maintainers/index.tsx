// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import MaintainersList from '~/components/maintainers/MaintainersList'
import {maintainers as config} from '~/components/projects/edit/maintainers/config'
import {useCommunityContext} from '~/components/communities/context'
import {useCommunityMaintainers} from './useCommunityMaintainers'
import CommunityMaintainerLinks from './CommunityMaintainersLinks'

type DeleteModal = {
  open: boolean,
  // unique account id
  account?: string,
  displayName?: string
}

export default function CommunityMaintainersPage() {
  const {community} = useCommunityContext()
  const {loading,maintainers,deleteMaintainer} = useCommunityMaintainers({community: community?.id})
  const [modal, setModal] = useState<DeleteModal>({
    open: false
  })

  // console.group('CommunityMaintainersPage')
  // console.log('id...', id)
  // console.log('modal...', modal)
  // console.log('maintainers...', maintainers)
  // console.log('loading...', loading)
  // console.groupEnd()

  if (loading) {
    return (
      <ContentLoader />
    )
  }

  function closeModal() {
    setModal({
      open: false,
    })
  }

  function onDeleteMaintainer(pos: number) {
    const maintainer = maintainers[pos]
    if (maintainer) {
      setModal({
        open: true,
        account: maintainer.account,
        displayName: maintainer.name
      })
    }
  }

  return (
    <>
      <BaseSurfaceRounded
        className="flex-1 p-8 mb-12 xl:grid xl:grid-cols-[1fr_1fr] xl:gap-8"
        type="section"
      >
        <div>
          <EditSectionTitle
            title={config.title}
          />
          <MaintainersList
            onDelete={onDeleteMaintainer}
            maintainers={maintainers}
          />
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <EditSectionTitle
            title={config.inviteLink.title}
            subtitle={config.inviteLink.subtitle}
          />
          <CommunityMaintainerLinks />
        </div>
      </BaseSurfaceRounded>
      <ConfirmDeleteModal
        open={modal.open}
        title="Remove maintainer"
        body={
          <p>Are you sure you want to remove <strong>{modal.displayName ?? 'No name'}</strong>?</p>
        }
        onCancel={closeModal}
        onDelete={()=>{
          deleteMaintainer(modal.account)
          closeModal()
        }}
      />
    </>
  )
}

