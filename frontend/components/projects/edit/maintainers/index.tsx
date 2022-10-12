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
import useProjectContext from '../useProjectContext'
import useProjectMaintainers, {deleteMaintainerFromProject, MaintainerOfProject} from './useProjectMaintainer'
import ProjectMaintainersList from './ProjectMaintainersList'
import ProjectMaintainerLink from './ProjectMaintainerLink'
import {maintainers as config} from './config'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import useSnackbar from '~/components/snackbar/useSnackbar'

type DeleteModal = {
  open: boolean,
  pos?: number,
  displayName?:string
}


export default function ProjectMaintainers() {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {loading:loadProject, setLoading, project} = useProjectContext()
  const {loading:loadMaintainers,maintainers} = useProjectMaintainers({
    project: project.id,
    token
  })
  const [projectMaintainers, setProjectMaintaners] = useState<MaintainerOfProject[]>([])
  const [modal, setModal] = useState<DeleteModal>({
    open: false
  })

  useEffect(() => {
    let abort = false
    if (loadMaintainers === false &&
      abort === false) {
      setProjectMaintaners(maintainers)
      setLoading(false)
    }
    return () => { abort = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[maintainers,loadMaintainers])

  if (loadProject || loadMaintainers) {
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
      const resp = await deleteMaintainerFromProject({
        maintainer: admin.account,
        project: project.id,
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
          <ProjectMaintainerLink
            project={project.id}
            title={project.title}
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
