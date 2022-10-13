// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ProjectMaintainersList from '~/components/projects/edit/maintainers/ProjectMaintainersList'
import {maintainers as config} from '~/components/projects/edit/maintainers/config'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useSoftwareContext from '../useSoftwareContext'
import useSoftwareMaintainers, {
  deleteMaintainerFromSoftware, MaintainerOfSoftware
} from './useSoftwareMaintainers'
import SoftwareMaintainerLink from './SoftwareMaintainerLink'

type DeleteModal = {
  open: boolean,
  pos?: number,
  displayName?:string
}

export default function SoftwareMaintainers() {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {software} = useSoftwareContext()
  const {loading,maintainers} = useSoftwareMaintainers()
  const [projectMaintainers, setProjectMaintaners] = useState<MaintainerOfSoftware[]>([])
  const [modal, setModal] = useState<DeleteModal>({
    open: false
  })

  useEffect(() => {
    let abort = false
    if (loading === false &&
      abort === false) {
      setProjectMaintaners(maintainers)
      // setLoading(false)
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
      const resp = await deleteMaintainerFromSoftware({
        maintainer: admin.account,
        software: software.id ?? '',
        token,
        frontend: true
      })
      if (resp.status === 200) {
        const newMaintainersList = [
          ...maintainers.slice(0, pos),
          ...maintainers.slice(pos+1)
        ]
        setProjectMaintaners(newMaintainersList)
      } else {
        showErrorMessage(`Failed to remove maintainer. ${resp.message}`)
      }
    }
  }

  return (
    <>
      <EditSection className='xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <EditSectionTitle
            title={config.title}
          />
          <ProjectMaintainersList
            onDelete={onDeleteMaintainer}
            maintainers={projectMaintainers}
          />
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <EditSectionTitle
            title={config.inviteLink.title}
            subtitle={config.inviteLink.subtitle}
          />
          <SoftwareMaintainerLink
            software={software.id ?? ''}
            brand_name={software.brand_name}
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
    </>
  )
}
