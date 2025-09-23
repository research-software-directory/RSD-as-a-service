// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import Alert from '@mui/material/Alert'

import ContentLoader from '~/components/layout/ContentLoader'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
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
      No projects to show.
    </Alert>
  )

  return (
    <>
      <ListOverviewSection>
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
      </ListOverviewSection>
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
