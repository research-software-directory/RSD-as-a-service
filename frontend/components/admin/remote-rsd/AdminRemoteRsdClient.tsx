// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import Searchbox from '~/components/search/Searchbox'
import Pagination from '~/components/pagination/Pagination'
import RemoteRsdModal from './RemoteRsdModal'
import useRemoteRsd from './useRemoteRsd'
import {EditRemoteRsd} from './apiRemoteRsd'
import RemoteRsdList from './RemoteRsdList'

type ModalProps={
  open: boolean
  remoteRsd?: EditRemoteRsd
}

export default function AdminRemoteRsdClient() {
  const [modal, setModal] = useState<ModalProps>()
  const {loading, remoteRsd, addRemote,patchRemote, deleteRemote} = useRemoteRsd()

  // console.group('AdminRemoteRsd')
  // console.log('loading...',loading)
  // console.log('remoteRsd...', remoteRsd)
  // console.groupEnd()

  async function submitRemote(data:EditRemoteRsd){
    let done:boolean
    if (data.id){
      done = await patchRemote({
        id: data.id,
        data
      })
    }else{
      done = await addRemote(data)
    }
    // close modal on success
    if (done===true){
      setModal({open:false})
    }
  }

  return (
    <>
      <section className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_1fr] xl:px-0 xl:gap-8">
        <div>
          <div className="flex flex-wrap items-center justify-end">
            <Searchbox />
            <Pagination />
          </div>
          <div className="pt-2">
            <RemoteRsdList
              remoteRsd={remoteRsd}
              loading={loading}
              onDelete={deleteRemote}
              onEdit={(item)=>{
                setModal({
                  open: true,
                  remoteRsd: item
                })
              }}
            />
          </div>
        </div>
        <div className="flex items-start justify-end">
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={()=>setModal({
              open:true,
            })}
          >
            Add
          </Button>
        </div>
      </section>
      {
        modal?.open ?
          <RemoteRsdModal
            remoteRsd={modal?.remoteRsd}
            onCancel={()=>setModal({open:false})}
            onSubmit={submitRemote}
          />
          : null
      }
    </>
  )
}
