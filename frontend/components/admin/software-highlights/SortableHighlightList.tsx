// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import useRsdSettings from '~/config/useRsdSettings'
import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import SortableList from '~/components/layout/SortableList'
import SortableHighlightItem from './SortableHighlightItem'
import {SoftwareHighlight} from './apiSoftwareHighlights'

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
  const {host} = useRsdSettings()
  const [modal, setModal] = useState<DeleteOrganisationModal>({
    open: false
  })
  const limit = (host?.software_highlights?.limit ?? 3)
  let publishedCnt = 0

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

  function onRenderItem(item: SoftwareHighlight, index: number) {
    // increase published items count (only published items are included in carousel)

    if (item.is_published===true) publishedCnt += 1
    // validate if limit is reached
    const inCarousel = (limit >= publishedCnt) && item.is_published
    return (
      <SortableHighlightItem
        key={item.id}
        item={item}
        inCarousel={inCarousel}
        onEdit={()=>onEdit(index)}
        onDelete={()=>confirmDelete(index)}
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
              Are you sure you want to delete software <strong>{modal?.highlight?.brand_name}</strong> from highlights?
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
