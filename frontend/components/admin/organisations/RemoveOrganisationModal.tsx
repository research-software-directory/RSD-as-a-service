// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import TextField from '@mui/material/TextField'

import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {OrganisationAdminProps} from './apiOrganisation'

export type OrganisationModalProps={
  open: boolean
  item?: OrganisationAdminProps
}

type RemoveOrganisationModalProps={
  item?: OrganisationAdminProps
  onCancel: ()=>void
  onDelete: ()=>void
}

export default function RemoveOrganisationModal({item,onCancel,onDelete}:RemoveOrganisationModalProps) {
  const [confirmation,setConfirmation] = useState<string>('')
  return (
    <ConfirmDeleteModal
      open={true}
      title="Delete organisation"
      removeDisabled={item?.name!==confirmation}
      body={
        <>
          <p>
            Are you sure you want to delete this organisation?
          </p>
          <p className="py-4">
            <strong>{item?.name}</strong>
          </p>
          <TextField
            label="Name of the organisation to delete"
            helperText={
              <span>Type the organisation name exactly as shown above.</span>
            }
            value = {confirmation}
            onChange={({target})=>setConfirmation(target.value)}
            sx={{
              width: '100%',
              margin: '1rem 0rem'
            }}
          />
          <p className="text-error text-base">
            This will remove organisation from all related RSD entries too!
          </p>
        </>
      }
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}
