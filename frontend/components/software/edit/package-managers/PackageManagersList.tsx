// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import ContentLoader from '~/components/layout/ContentLoader'
import SortableList from '~/components/layout/SortableList'
import {PackageManager} from './apiPackageManager'
import PackageManagerItem from './PackageManagerItem'

type PackageManagersListProps = Readonly<{
  loading: boolean
  managers: PackageManager[]
  onDelete: (id: string) => void
  onSorted: (newList:PackageManager[])=>void
}>

type DeletePackManModal = Readonly<{
  open: boolean,
  id: string
  location: string
}>

export default function PackageManagersList({loading,managers,onSorted,onDelete}:PackageManagersListProps) {
  const [modal, setModal] = useState<DeletePackManModal>()

  if (loading) return <ContentLoader />

  if (managers.length === 0) {
    return (
      <Alert severity="warning"
        sx={{
          flex:1,
          marginTop: '0.5rem'
        }}
      >
        <AlertTitle sx={{fontWeight:500}}>No download locations</AlertTitle>
        Please provide <strong>download locations</strong> of your software using Add button.
      </Alert>
    )
  }

  function confirmDelete(pos: number) {
    const item = managers[pos]
    if (item.id && item.url) {
      setModal({
        open: true,
        id: item.id,
        location: item.url
      })
    }
  }

  function onRenderItem(item: PackageManager, index: number) {
    return (
      <PackageManagerItem
        key={item.id}
        item={item}
        onDelete={()=> confirmDelete(index)}
      />
    )
  }

  return (
    <>
      <SortableList
        items={managers}
        onSorted={onSorted}
        onRenderItem={onRenderItem}
      />
      {modal &&
        <ConfirmDeleteModal
          title="Remove package manager"
          open={modal?.open ?? false}
          body={
            <p>Are you sure you want to remove installation location <strong>{modal.location ?? ''}</strong>?</p>
          }
          onCancel={() => {
            setModal(undefined)
          }}
          onDelete={() => {
            onDelete(modal.id)
            setModal(undefined)
          }}
        />
      }
    </>
  )
}
