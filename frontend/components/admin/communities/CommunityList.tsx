// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import List from '@mui/material/List'

import ContentLoader from '~/components/layout/ContentLoader'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import CommunityListItem from './CommunityListItem'
import NoCommunityAlert from './NoCommunityAlert'
import RemoveCommunityModal, {CommunityModalProps} from './RemoveCommunityModal'


type OrganisationsAdminListProps = {
  communities: CommunityListProps[]
  loading: boolean
  page: number
  onDeleteItem: (id:string,logo_id:string|null)=>void
}

export default function CommunityList({communities,loading,page,onDeleteItem}:OrganisationsAdminListProps) {
  const [modal, setModal] = useState<CommunityModalProps>({
    open: false
  })

  if (loading && !page) return <div className="py-6"><ContentLoader /></div>

  if (communities.length===0) return <div className="py-6"><NoCommunityAlert /></div>

  return (
    <>
      <List sx={{
        width: '100%',
      }}>
        {
          communities.map(item => {
            return (
              <CommunityListItem
                key={item.id}
                item={item}
                onDelete={()=>setModal({
                  open: true,
                  item
                })}
              />
            )
          })
        }
      </List>
      {
        modal.open ?
          <RemoveCommunityModal
            item = {modal.item}
            onCancel={() => {
              setModal({
                open: false
              })
            }}
            onDelete={() => {
            // call remove method if id present
              if (modal.item && modal.item?.id) onDeleteItem(modal.item?.id,modal.item?.logo_id)
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
