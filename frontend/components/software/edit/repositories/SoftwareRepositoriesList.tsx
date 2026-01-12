// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import SortableList from '~/components/layout/SortableList'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {DeleteModalProps} from '~/components/software/edit/editSoftwareTypes'
import SoftwareRepositoryListItem from './SoftwareRepositoryListItem'
import {RepositoryForSoftware} from './apiRepositories'

type SortableRepositoriesProps=Readonly<{
  items: RepositoryForSoftware[],
  onDelete:(id:string)=>void,
  onSorted:(items: RepositoryForSoftware[])=>void
}>

export default function SoftwareRepositoriesList({items, onDelete, onSorted}:SortableRepositoriesProps) {
  // Manage modal state
  const [modal, setModal] = useState<DeleteModalProps>({
    open: false
  })

  if (items.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No software repository defined</AlertTitle>
        Add repository using <strong>ADD button!</strong>
      </Alert>
    )
  }

  /**
   * This method is called by SortableList component to enable
   * rendering of custom sortable items
   * @param item
   * @param index
   * @returns React.JSX.Element
   */
  function renderListItem(item:RepositoryForSoftware,index?:number) {
    return (
      <SoftwareRepositoryListItem
        key={JSON.stringify(item)}
        item={item}
        onDelete={()=>{
          setModal({
            open: true,
            displayName: item.url as string,
            pos: index,
            id: item.id as string
          })
        }}
      />
    )
  }

  return (
    <>
      <SortableList
        items={items}
        onRenderItem={renderListItem}
        onSorted={onSorted}
      />
      {/* confirm delete modal */}
      {modal.open ?
        <ConfirmDeleteModal
          title="Remove repository"
          open={modal.open}
          body={
            <p>Are you sure you want to remove repository <strong>{modal.displayName ?? ''}</strong>?</p>
          }
          onCancel={()=>setModal({open:false})}
          onDelete={()=> {
            if (typeof modal.id === 'string'){
              onDelete(modal.id)
            }
            setModal({open:false})
          }}
        />
        : null
      }
    </>
  )
}
