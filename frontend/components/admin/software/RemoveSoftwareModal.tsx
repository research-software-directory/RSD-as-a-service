// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import TextField from '@mui/material/TextField'

import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'

export type SoftwareModalProps={
  open: boolean
  item?: SoftwareOverviewItemProps
}

type RemoveSoftwareModalProps={
  item?: SoftwareOverviewItemProps
  onCancel: ()=>void
  onDelete: ()=>void
}

export default function RemoveSoftwareModal({item,onCancel,onDelete}:RemoveSoftwareModalProps) {
  const [confirmation,setConfirmation] = useState<string>('')
  return (
    <ConfirmDeleteModal
      open={true}
      title="Delete software"
      removeDisabled={item?.brand_name!==confirmation}
      body={
        <>
          <p>
            Are you sure you want to delete this software?
          </p>
          <p className="py-4">
            <strong>{item?.brand_name}</strong>
          </p>
          <TextField
            label="Name of the software to delete"
            helperText={
              <span>Type the software name exactly as shown above.</span>
            }
            value = {confirmation}
            onChange={({target})=>setConfirmation(target.value)}
            sx={{
              width: '100%',
              margin: '1rem 0rem'
            }}
          />
          <p className="text-error text-base">
            This will remove all data related to this software from RSD!
          </p>
        </>
      }
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}
