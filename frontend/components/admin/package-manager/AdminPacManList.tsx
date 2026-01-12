// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Alert from '@mui/material/Alert'
import List from '@mui/material/List'

import ContentLoader from '~/components/layout/ContentLoader'

import RemovePacManModal from './RemovePacManModal'
import EditPackageManagerModal from './EditPackageManagerModal'
import useAdminPacMan from './useAdminPacMan'
import {PackageManager} from '~/components/software/edit/package-managers/apiPackageManager'
import AdminPacManListItem from './AdminPacManListItem'

export default function AdminPacManList() {
  // manage modals
  const [modal,setModal] = useState<{
    delete:boolean,
    edit: boolean,
    item: PackageManager | null
  }>({
    delete: false,
    edit: false,
    item: null
  })

  const {loading,managers,updateManager,deleteManager} = useAdminPacMan()

  if (loading) return <div className="py-6"><ContentLoader /></div>

  if (managers.length===0){
    return (
      <Alert severity="info">
        No package managers to show.
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
        {managers.map((item)=>{
          return (
            <AdminPacManListItem
              key={item.id}
              item={item}
              onEdit={()=>setModal({
                delete: false,
                edit:true,
                item
              })}
              onDelete={()=>setModal({
                delete: true,
                edit: false,
                item
              })}
            />
          )
        })}
      </List>

      {/* DELETE modal */}
      {
        modal.delete && modal.item ?
          <RemovePacManModal
            item={modal.item}
            onCancel={closeModals}
            onDelete={()=>{
              if (modal?.item?.id) deleteManager(modal.item.id)
              closeModals()
            }}
          />
          : null
      }

      {/* EDIT modal */}
      {
        modal.edit && modal.item ?
          <EditPackageManagerModal
            package_manager={modal.item}
            onCancel={closeModals}
            onSubmit={(data)=>{
              // console.log('Update...',data)
              updateManager({
                id: data?.id,
                data:{
                  package_manager: data.package_manager,
                  download_count_scraping_disabled_reason: data.download_count_scraping_disabled_reason,
                  reverse_dependency_count_scraping_disabled_reason: data.reverse_dependency_count_scraping_disabled_reason,
                  download_count_last_error: data.download_count_last_error ?? null,
                  reverse_dependency_count_last_error: data.reverse_dependency_count_last_error ?? null
                }
              })
              closeModals()
            }}
          />
          : null
      }
    </>
  )
}
