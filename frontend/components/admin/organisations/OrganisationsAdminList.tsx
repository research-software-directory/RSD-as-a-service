// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import List from '@mui/material/List'
import Alert from '@mui/material/Alert'

import ContentLoader from '~/components/layout/ContentLoader'
import {OrganisationAdminProps, RemoveOrganisationProps} from './apiOrganisation'
import OrganisationItem from './OrganisationItem'
import RemoveOrganisationModal, {OrganisationModalProps} from './RemoveOrganisationModal'

type OrganisationsAdminListProps = {
  organisations: OrganisationAdminProps[]
  loading: boolean
  page: number
  onDeleteOrganisation: (props:RemoveOrganisationProps)=>void
}

export default function OrganisationsAdminList({organisations,loading,page,onDeleteOrganisation}:OrganisationsAdminListProps) {
  const [modal, setModal] = useState<OrganisationModalProps>({
    open: false
  })

  if (loading && !page) return <div className="py-6"><ContentLoader /></div>

  if (organisations.length === 0){
    return (
      <Alert severity="info">
        No organisation to show.
      </Alert>
    )
  }

  function onDelete(organisation:OrganisationAdminProps) {
    if (organisation) {
      setModal({
        open: true,
        item: organisation
      })
    }
  }

  return (
    <>
      <List sx={{
        width: '100%',
      }}>
        {
          organisations.map(item => {
            return (
              <OrganisationItem
                key={item.id}
                item={item}
                onDelete={()=>onDelete(item)}
              />
            )
          })
        }
      </List>
      {modal?.open ?
        <RemoveOrganisationModal
          item = {modal?.item}
          onCancel={() => {
            setModal({
              open: false
            })
          }}
          onDelete={() => {
            onDeleteOrganisation({
              uuid: modal?.item?.id ?? '',
              logo_id: modal?.item?.logo_id ?? null
            })
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
