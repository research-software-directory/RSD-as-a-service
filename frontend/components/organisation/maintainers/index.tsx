// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {maintainers as config} from '~/components/projects/edit/maintainers/config'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useOrganisationMaintainers, {
  deleteMaintainerFromOrganisation
} from './useOrganisationMaintainers'
import OrganisationMaintainerLink from './OrganisationMaintainerLink'
import {OrganisationForOverview} from '~/types/Organisation'
import OrganisationMaintainersList from './OrganisationMaintainersList'
import ProtectedOrganisationPage from '../ProtectedOrganisationPage'
import UserAgrementModal from '~/components/user/settings/UserAgreementModal'

type DeleteModal = {
  open: boolean,
  pos?: number,
  displayName?:string
}


export default function OrganisationMaintainers({organisation, isMaintainer}:
  { organisation: OrganisationForOverview, isMaintainer: boolean }) {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {loading,maintainers,setMaintainers} = useOrganisationMaintainers({
    organisation: organisation.id ?? '',
    token
  })
  const [modal, setModal] = useState<DeleteModal>({
    open: false
  })

  // console.group('OrganisationMaintainers')
  // console.log('OrganisationMaintainers.maintainers...', maintainers)
  // console.log('OrganisationMaintainers.organisationMaintainers...', organisationMaintainers)
  // console.log('OrganisationMaintainers.loading...', loading)
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
        pos,
        displayName: maintainer.name
      })
    }
  }

  async function deleteMaintainer(pos: number) {
    // console.log('delete maintainer...pos...', pos)
    closeModal()
    const admin = maintainers[pos]
    if (admin) {
      const resp = await deleteMaintainerFromOrganisation({
        maintainer: admin.account,
        organisation: organisation.id ?? '',
        token,
        frontend: true
      })
      if (resp.status === 200) {
        const newMaintainersList = [
          ...maintainers.slice(0, pos),
          ...maintainers.slice(pos+1)
        ]
        setMaintainers(newMaintainersList)
      } else {
        showErrorMessage(`Failed to remove maintainer. ${resp.message}`)
      }
    }
  }

  return (
    <ProtectedOrganisationPage
      isMaintainer={isMaintainer}
    >
      <UserAgrementModal />
      <section className='xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4">
          <EditSectionTitle
            title={config.title}
          />
          <OrganisationMaintainersList
            onDelete={onDeleteMaintainer}
            maintainers={maintainers}
          />
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <EditSectionTitle
            title={config.inviteLink.title}
            subtitle={config.inviteLink.subtitle}
          />
          <OrganisationMaintainerLink
            organisation={organisation.id ?? ''}
            name={organisation.name}
            account={user?.account ?? ''}
            token={token}
          />
        </div>
      </section>
      <ConfirmDeleteModal
        open={modal.open}
        title="Remove maintainer"
        body={
          <p>Are you sure you want to remove <strong>{modal.displayName ?? 'No name'}</strong>?</p>
        }
        onCancel={() => {
          setModal({
            open:false
          })
        }}
        onDelete={()=>deleteMaintainer(modal.pos ?? 0)}
      />
    </ProtectedOrganisationPage>
  )
}
