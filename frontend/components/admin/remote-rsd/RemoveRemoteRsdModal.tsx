// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import TextField from '@mui/material/TextField'

import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {RemoteRsd} from './apiRemoteRsd'

export type RemoteRsdModalProps={
  open: boolean
  item?: RemoteRsd
}

type RemoveRemoteRsdModalProps=Readonly<{
  item: RemoteRsd
  onCancel: ()=>void
  onDelete: ()=>void
}>

export default function RemoveRemoteRsdModal({item,onCancel,onDelete}:RemoveRemoteRsdModalProps) {
  const [confirmation,setConfirmation] = useState<string>('')
  return (
    <ConfirmDeleteModal
      open={true}
      title="Delete remote RSD"
      removeDisabled={item?.domain!==confirmation}
      body={
        <>
          <p>
            Are you sure you want to delete {item.label}?
          </p>
          <p className="py-4">
            <strong>{item.domain}</strong>
          </p>
          <TextField
            label="Remote RSD url"
            helperText={
              <span>Type the url to remote RSD exactly as shown above.</span>
            }
            value = {confirmation}
            onChange={({target})=>setConfirmation(target.value)}
            sx={{
              width: '100%',
              margin: '1rem 0rem'
            }}
          />
          <p className="text-error text-base">
            This will remove remote RSD and all related entries too!
          </p>
        </>
      }
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}
