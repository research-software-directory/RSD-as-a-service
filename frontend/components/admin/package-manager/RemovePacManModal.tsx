// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import TextField from '@mui/material/TextField'

import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {PackageManager} from '~/components/software/edit/package-managers/apiPackageManager'

type RemovePacManModalProps=Readonly<{
  item?: PackageManager
  onCancel: ()=>void
  onDelete: ()=>void
}>

export default function RemovePacManModal({item,onCancel,onDelete}:RemovePacManModalProps) {
  const [confirmation,setConfirmation] = useState<string>('')
  return (
    <ConfirmDeleteModal
      open={true}
      title="Delete package manager"
      removeDisabled={item?.url!==confirmation}
      body={
        <>
          <p>
            Are you sure you want to delete this package manager?
          </p>
          <p className="py-4 wrap-break-word">
            <strong>{item?.url}</strong>
          </p>
          <TextField
            label="Url to delete"
            helperText={
              <span>Type the url exactly as shown above.</span>
            }
            value = {confirmation}
            onChange={({target})=>setConfirmation(target.value)}
            sx={{
              width: '100%',
              margin: '1rem 0rem'
            }}
          />
          <p className="text-error text-base">
            This will remove package manager for all related software entries!
          </p>
        </>
      }
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}
