// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Alert from '@mui/material/Alert'

import ContentLoader from '~/components/layout/ContentLoader'
import ProjectOverviewList from '~/components/projects/overview/list/ProjectOverviewList'
import useAdminProjects from './useAdminProjects'
import AdminProjectListItem from './AdminProjectListItem'
import RemoveProjectModal, {ProjectModalProps} from './RemoveProjectModal'

export default function AdminProjectList() {
  const {projects,loading,page,deleteProject} = useAdminProjects()
  const [modal,setModal] = useState<ProjectModalProps>({
    open:false
  })

  if (loading && !page) return <ContentLoader />

  if (projects.length===0) return (
    <Alert severity="info">
      No software to show.
    </Alert>
  )

  return (
    <>
      <ProjectOverviewList>
        {projects.map(item=>{
          return (
            <AdminProjectListItem
              key={item.id}
              project={item}
              onDelete={()=>{
                setModal({
                  open: true,
                  item
                })
              }}
            />
          )
        })}
      </ProjectOverviewList>
      {
        modal.open ?
          <RemoveProjectModal
            item = {modal.item}
            onCancel={() => {
              setModal({
                open: false
              })
            }}
            onDelete={() => {
              // call remove method if id present
              if (modal.item) deleteProject(modal.item)
              setModal({
                open: false
              })
            }}
          />
          : null
      }
    </>
  )
}
