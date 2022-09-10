// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {maintainers as config} from '~/components/projects/edit/maintainers/config'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useOrganisationMaintainers, {
  deleteMaintainerFromOrganisation, MaintainerOfOrganisation
} from './useOrganisationMaintainer'
import OrganisationMaintainerLink from './OrganisationMaintainerLink'
import {OrganisationForOverview} from '~/types/Organisation'
import OrganisationMaintainersList from './OrganisationMaintainersList'
import ProtectedOrganisationPage from '../ProtectedOrganisationPage'

type DeleteModal = {
  open: boolean,
  pos?: number,
  displayName?:string
}


export default function OrganisationMaintainers({organisation, isMaintainer}:
  { organisation: OrganisationForOverview, isMaintainer: boolean }) {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {loading,maintainers} = useOrganisationMaintainers({
    organisation: organisation.id ?? '',
    token
  })
  const [organisationMaintainers, setOrganisationMaintaners] = useState<MaintainerOfOrganisation[]>([])
  const [modal, setModal] = useState<DeleteModal>({
    open: false
  })

  useEffect(() => {
    let abort = false
    if (loading === false &&
      abort === false) {
      setOrganisationMaintaners(maintainers)
    }
    return () => { abort = true }
  },[maintainers,loading])

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
        setOrganisationMaintaners(newMaintainersList)
      } else {
        showErrorMessage(`Failed to remove maintainer. ${resp.message}`)
      }
    }
  }

  return (
    <ProtectedOrganisationPage
      isMaintainer={isMaintainer}
    >
      <EditSection className='xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <EditSectionTitle
            title={config.title}
          />
          <OrganisationMaintainersList
            onDelete={onDeleteMaintainer}
            maintainers={organisationMaintainers}
          />
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <EditSectionTitle
            title={config.inviteLink.title}
            subtitle={config.inviteLink.subtitle}
          />
          <OrganisationMaintainerLink
            organisation={organisation.id ?? ''}
            account={user?.account ?? ''}
            token={token}
          />
        </div>
      </EditSection>
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
