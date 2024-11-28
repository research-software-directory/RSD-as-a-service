// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useContext, useState} from 'react'
import List from '@mui/material/List'

import ContentLoader from '~/components/layout/ContentLoader'
import PaginationContext from '~/components/pagination/PaginationContext'
import RemoteRsdListItem from './RemoteRsdListItem'
import NoRemotesAlert from './NoRemotesAlert'
import RemoveRemoteRsdModal, {RemoteRsdModalProps} from './RemoveRemoteRsdModal'
import {RemoteRsd} from './apiRemoteRsd'


type OrganisationsAdminListProps = Readonly<{
  remoteRsd: RemoteRsd[]
  loading: boolean
  onDelete: (id:string)=>void
  onEdit: (item:RemoteRsd)=>void
}>

export default function RemoteRsdList({remoteRsd,loading,onDelete,onEdit}:OrganisationsAdminListProps) {
  const {pagination:{page}} = useContext(PaginationContext)
  const [modal, setModal] = useState<RemoteRsdModalProps>({
    open: false
  })

  if (loading && !page) return <div className="py-6"><ContentLoader /></div>

  if (remoteRsd.length===0) return <div className="py-6"><NoRemotesAlert /></div>

  return (
    <>
      <List sx={{
        width: '100%',
      }}>
        {
          remoteRsd.map(item => {
            return (
              <RemoteRsdListItem
                key={item.id}
                item={item}
                onDelete={()=>setModal({
                  open: true,
                  item
                })}
                onEdit={()=>onEdit(item)}
              />
            )
          })
        }
      </List>
      {
        modal.open && modal.item ?
          <RemoveRemoteRsdModal
            item = {modal.item}
            onCancel={() => {
              setModal({
                open: false
              })
            }}
            onDelete={() => {
            // call remove method if id present
              if (modal.item && modal.item?.id) onDelete(modal.item?.id)
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
