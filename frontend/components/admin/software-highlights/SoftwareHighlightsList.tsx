// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import List from '@mui/material/List'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import SoftwareHighlightItem from './SoftwareHighlightItem'
import {SoftwareHighlight} from './apiSoftwareHighlights'

type DeleteOrganisationModal = {
  open: boolean,
  highlight?: SoftwareHighlight
}

type SoftwareHighlightsListProps = {
  highlights: SoftwareHighlight[]
  loading: boolean
  onDeleteHighlight: (id:string)=>void
}

export default function SoftwareHighlightsList({highlights,loading,onDeleteHighlight}:SoftwareHighlightsListProps) {
  const [modal, setModal] = useState<DeleteOrganisationModal>({
    open: false
  })

  if (loading) return <ContentLoader />

  if (highlights.length === 0) {
    return (
      <Alert severity="info"
        sx={{marginTop: '0.5rem'}}
      >
        <AlertTitle sx={{fontWeight:500}}>No software highlights</AlertTitle>
        You can add software to highlight section <strong>using search on the right</strong>.
      </Alert>
    )
  }

  function onDelete(highlight:SoftwareHighlight) {
    if (highlight) {
      setModal({
        open: true,
        highlight
      })
    }
  }

  return (
     <>
      <List sx={{
        width: '100%',
      }}>
        {
          highlights.map(item => {
            return (
              <SoftwareHighlightItem
                key={item.id}
                data={item}
                onDelete={()=>onDelete(item)}
              />
            )
          })
        }
      </List>
      <ConfirmDeleteModal
        open={modal.open}
        title="Remove software highlight"
        body={
          <>
            <p>
              Are you sure you want to delete software <strong>{modal?.highlight?.brand_name}</strong> from hightlight?
            </p>
          </>
        }
        onCancel={() => {
          setModal({
            open: false
          })
        }}
        onDelete={() => {
          if (modal?.highlight?.id) {
            onDeleteHighlight(modal?.highlight?.id)
          }
          setModal({
            open: false
          })
        }}
      />
    </>
  )
}
