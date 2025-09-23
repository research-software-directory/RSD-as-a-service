// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useSoftwareContext from '../context/useSoftwareContext'
import {cfg} from './config'
import EditSoftwareHeritageModal from './EditSoftwareHeritageModal'
import {NewSoftwareHeritage,SoftwareHeritageItem} from './apiSoftwareHeritage'
import useSoftwareHeritage from './useSoftwareHeritage'
import SoftwareHeritageInfo from './SoftwareHeritageInfo'
import SoftwareHeritageList from './SoftwareHeritageList'

type EditSoftwareHeritageModal = {
  open: boolean,
  item: SoftwareHeritageItem|NewSoftwareHeritage
  pos?: number
  edit: boolean
}

export default function SoftwareHeritagePage() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {software} = useSoftwareContext()
  const {swhids, sortList,saveItem,updateItem,deleteItem} = useSoftwareHeritage({
    software: software.id,
    token
  })
  const [modal, setModal] = useState<EditSoftwareHeritageModal>()

  // console.group('SoftwareHeritagePage')
  // console.log('loading...', loading)
  // console.log('software...', software)
  // console.log('managers...', managers)
  // console.log('token...', token)
  // console.groupEnd()

  function onAdd() {
    // create new PM item
    const newSH: NewSoftwareHeritage = {
      id: null,
      software: software.id,
      swhid: '',
      position: swhids.length + 1
    }

    setModal({
      open: true,
      item: newSH,
      edit: false
    })
  }

  function onEdit(pos:number){
    const item = swhids[pos]
    if (item) {
      setModal({
        open: true,
        pos,
        item,
        edit: true
      })
    }
  }

  async function onSorted(newList:SoftwareHeritageItem[]) {
    const resp = await sortList(newList)
    if (resp.status !== 200) {
      showErrorMessage(`Failed to sort items. ${resp.message}`)
    }
  }

  async function onDelete(pos: number) {
    const item = swhids[pos]
    if (item) {
      const resp = await deleteItem(item.id)
      if (resp.status !== 200) {
        showErrorMessage(`Failed to remove item. ${resp.message}`)
      }
    } else {
      showErrorMessage('Failed to remove item. The item is missing!')
    }
  }

  async function saveSoftwareHeritage(data: NewSoftwareHeritage | SoftwareHeritageItem) {
    let resp
    if (data.id){
      // update if id present
      resp = await updateItem(data as SoftwareHeritageItem)
    }else{
      // create new
      resp = await saveItem(data)
    }
    if (resp.status !== 200) {
      showErrorMessage(`Failed to save ${data.swhid}. ${resp.message}`)
    } else {
      setModal(undefined)
    }
  }

  return (
    <>
      <EditSection className="py-4">
        <EditSectionTitle
          title={cfg.title}
          subtitle={cfg.subtitle}
        >
          <Button
            variant='contained'
            data-testid="add-package-manager-btn"
            startIcon={<AddIcon />}
            onClick={onAdd}
          >
            Add
          </Button>
        </EditSectionTitle>
        <div className="flex-1 xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem] items-start">
          <div className="flex-1">
            <SoftwareHeritageList
              items = {swhids}
              onSorted={onSorted}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
          <div>
            <SoftwareHeritageInfo />
          </div>
        </div>
      </EditSection>
      {
        modal &&
        <EditSoftwareHeritageModal
          swhid_item={modal.item}
          onCancel={() => {
            setModal(undefined)
          }}
          onSubmit={saveSoftwareHeritage}
        />
      }
    </>
  )
}

