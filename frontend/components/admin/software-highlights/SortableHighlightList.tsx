// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {SoftwareHighlight} from './apiSoftwareHighlights'
import SortableList from '~/components/layout/SortableList'
import SortableHighlightItem from './SortableHightlightItem'
import {useRouter} from 'next/router'

type DeleteOrganisationModal = {
  open: boolean,
  highlight?: SoftwareHighlight
}

type SoftwareHighlightsListProps = {
  highlights: SoftwareHighlight[]
  loading: boolean
  onDelete: (id: string) => void
  onSorted: (highlights:SoftwareHighlight[])=>void
}

export default function SortableHighlightsList({highlights, loading, onSorted, onDelete}: SoftwareHighlightsListProps) {
  const router = useRouter()
  const [modal, setModal] = useState<DeleteOrganisationModal>({
    open: false
  })

  if (loading) return <ContentLoader />

  if (highlights.length === 0) {
    return (
      <Alert severity="warning"
        sx={{marginTop: '0.5rem'}}
      >
        <AlertTitle sx={{fontWeight:500}}>No software highlights</AlertTitle>
        You can add software to highlight section <strong>using search on the right</strong>.
      </Alert>
    )
  }

  function onEdit(pos: number) {
    const highlight = highlights[pos]
    if (highlight) {
      router.push(`/software/${highlight.slug}/edit`)
    }
  }

  function confirmDelete(pos: number) {
    const highlight = highlights[pos]
    if (highlight) {
      setModal({
        open: true,
        highlight
      })
    }
  }

  function onRenderItem(item: SoftwareHighlight, index?: number) {
    return (
      <SortableHighlightItem
        key={item.id}
        pos={index ?? 0}
        item={item}
        onEdit={onEdit}
        onDelete={confirmDelete}
      />
    )
  }

  return (
    <>
       <SortableList
        items={highlights}
        onSorted={onSorted}
        onRenderItem={onRenderItem}
      />

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
             onDelete(modal?.highlight?.id)
           }
           setModal({
             open: false
           })
         }}
       />
    </>
  )
}
