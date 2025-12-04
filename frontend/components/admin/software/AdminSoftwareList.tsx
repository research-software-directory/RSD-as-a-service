// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import Alert from '@mui/material/Alert'

import ContentLoader from '~/components/layout/ContentLoader'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import AdminSoftwareListItem from './AdminSoftwareListItem'
import {useAdminSoftware} from './useAdminSoftware'
import RemoveSoftwareModal, {SoftwareModalProps} from './RemoveSoftwareModal'

export default function AdminSoftwareList() {
  const {software,loading,page,deleteSoftware} = useAdminSoftware()
  const [modal,setModal] = useState<SoftwareModalProps>({
    open:false
  })

  if (loading && !page) return <ContentLoader />

  if (software.length===0) return (
    <Alert severity="info">
      No software to show.
    </Alert>
  )

  return (
    <>
      <ListOverviewSection>
        {software.map(item=>{
          return (
            <AdminSoftwareListItem
              key={item.id}
              software={item}
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
          <RemoveSoftwareModal
            item = {modal.item}
            onCancel={() => {
              setModal({
                open: false
              })
            }}
            onDelete={() => {
              // call delete method if id present
              if (modal.item) deleteSoftware(modal.item)
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
