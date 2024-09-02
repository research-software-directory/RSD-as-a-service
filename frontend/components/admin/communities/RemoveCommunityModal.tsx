// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import TextField from '@mui/material/TextField'

import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {CommunityListProps} from '~/components/communities/apiCommunities'

export type CommunityModalProps={
  open: boolean
  item?: CommunityListProps
}

type RemoveCommunityModalProps={
  item?: CommunityListProps
  onCancel: ()=>void
  onDelete: ()=>void
}

export default function RemoveCommunityModal({item,onCancel,onDelete}:RemoveCommunityModalProps) {
  const [confirmation,setConfirmation] = useState<string>('')
  return (
    <ConfirmDeleteModal
      open={true}
      title="Delete community"
      removeDisabled={item?.name!==confirmation}
      body={
        <>
          <p>
            Are you sure you want to delete this community?
          </p>
          <p className="py-4">
            <strong>{item?.name}</strong>
          </p>
          <TextField
            label="Name of the community to delete"
            helperText={
              <span>Type the community name exactly as shown above.</span>
            }
            value = {confirmation}
            onChange={({target})=>setConfirmation(target.value)}
            sx={{
              width: '100%',
              margin: '1rem 0rem'
            }}
          />
          <p className="text-error text-base">
            This will remove community from all related RSD entries too!
          </p>
        </>
      }
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}
