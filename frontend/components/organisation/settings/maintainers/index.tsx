// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import ContentLoader from '~/components/layout/ContentLoader'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {maintainers as config} from '~/components/projects/edit/maintainers/config'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import MaintainersList from '~/components/maintainers/MaintainersList'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'
import {useOrganisationMaintainers} from './useOrganisationMaintainers'
import OrganisationMaintainerLinks from './OrganisationMaintainerLinks'

type DeleteModal = {
  open: boolean,
  // unique account id
  account?: string,
  displayName?: string
}

export default function OrganisationMaintainers() {
  const {id} = useOrganisationContext()
  const {loading,maintainers,deleteMaintainer} = useOrganisationMaintainers({
    organisation: id ?? ''
  })
  const [modal, setModal] = useState<DeleteModal>({
    open: false
  })

  // console.group('OrganisationMaintainers')
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
      <BaseSurfaceRounded
        className="flex-1 p-4 mb-12 xl:grid xl:grid-cols-[1fr,1fr] xl:gap-8"
        type="section"
      >
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
          <OrganisationMaintainerLinks />
        </div>
      </BaseSurfaceRounded>
      <ConfirmDeleteModal
        open={modal.open}
        title="Remove maintainer"
        body={
          <p>Are you sure you want to remove <strong>{modal.displayName ?? 'No name'}</strong>?</p>
        }
        onCancel={closeModal}
        onDelete={()=>deleteMaintainer(modal.account)}
      />
    </>
  )
}
