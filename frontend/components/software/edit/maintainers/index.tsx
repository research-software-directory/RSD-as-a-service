// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {maintainers as config} from '~/components/projects/edit/maintainers/config'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import MaintainersList from '~/components/maintainers/MaintainersList'
import useSoftwareContext from '../context/useSoftwareContext'
import {useSoftwareMaintainers} from './useSoftwareMaintainers'
import SoftwareMaintainerLinks from './SoftwareMaintainerLinks'

type DeleteModal = {
  open: boolean,
  // unique account id
  account?: string,
  displayName?: string
}

export default function EditSoftwareMaintainers() {
  const {software} = useSoftwareContext()
  const {loading,maintainers,deleteMaintainer} = useSoftwareMaintainers({software:software.id})
  const [modal, setModal] = useState<DeleteModal>({
    open: false
  })

  if (loading) {
    return (
      <ContentLoader />
    )
  }

  function closeModal() {
    setModal({
      open: false
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
      <EditSection className='xl:grid xl:grid-cols-[1fr_1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4">
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
          <SoftwareMaintainerLinks />
        </div>
      </EditSection>
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
