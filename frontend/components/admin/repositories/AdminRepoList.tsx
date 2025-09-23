// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Alert from '@mui/material/Alert'
import List from '@mui/material/List'

import ContentLoader from '~/components/layout/ContentLoader'
import {RepositoryUrl} from '~/components/software/edit/repositories/apiRepositories'
import AdminRepoListItem from './AdminRepoListItem'
import useAdminRepos from './useAdminRepos'
import RemoveRepositoryModal from './RemoveRepositoryModal'
import EditRepositoryModal from './EditRepositoryModal'

export default function AdminRepoList() {
  // manage modals
  const [modal,setModal] = useState<{
    delete:boolean,
    edit: boolean,
    item: RepositoryUrl | null
  }>({
    delete: false,
    edit: false,
    item: null
  })

  const {loading,repositories,updateRepo,deleteRepo} = useAdminRepos()

  if (loading) return <div className="py-6"><ContentLoader /></div>

  if (repositories.length===0){
    return (
      <Alert severity="info">
        No repositories to show.
      </Alert>
    )
  }

  function closeModals(){
    setModal({
      delete: false,
      edit: false,
      item: null
    })
  }

  return (
    <>
      <List>
        {repositories.map((item)=>{
          return (
            <AdminRepoListItem
              key={item?.id ?? item.url}
              item={item}
              onDelete={()=>{
                setModal({
                  delete:true,
                  edit: false,
                  item
                })
              }}
              onEdit={()=>{
                setModal({
                  delete: false,
                  edit: true,
                  item
                })
              }}
            />
          )
        })}
      </List>

      {/* DELETE modal */}
      {
        modal.delete && modal.item ?
          <RemoveRepositoryModal
            item={modal.item}
            onCancel={closeModals}
            onDelete={()=>{
              if (modal?.item?.id) deleteRepo(modal.item.id)
              closeModals()
            }}
          />
          : null
      }

      {/* EDIT modal */}
      {
        modal.edit && modal.item ?
          <EditRepositoryModal
            item={modal.item}
            onCancel={closeModals}
            onSubmit={(props)=>{
              // console.log('Update...',data)
              updateRepo(props)
              closeModals()
            }}
          />
          : null
      }
    </>
  )
}
