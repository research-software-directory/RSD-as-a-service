// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import TextField from '@mui/material/TextField'

import {ProjectListItem} from '~/types/Project'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'

export type ProjectModalProps={
  open: boolean
  item?: ProjectListItem
}

type RemoveProjectModalProps={
  item?: ProjectListItem
  onCancel: ()=>void
  onDelete: ()=>void
}

export default function RemoveProjectModal({item,onCancel,onDelete}:RemoveProjectModalProps) {
  const [confirmation,setConfirmation] = useState<string>('')
  return (
    <ConfirmDeleteModal
      open={true}
      title="Delete project"
      removeDisabled={item?.title!==confirmation}
      body={
        <>
          <p>
            Are you sure you want to delete this project?
          </p>
          <p className="py-4">
            <strong>{item?.title}</strong>
          </p>
          <TextField
            label="Name of the project to delete"
            helperText={
              <span>Type the project name exactly as shown above.</span>
            }
            value = {confirmation}
            onChange={({target})=>setConfirmation(target.value)}
            sx={{
              width: '100%',
              margin: '1rem 0rem'
            }}
          />
          <p className="text-error text-base">
            This will remove all data related to this project from RSD!
          </p>
        </>
      }
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}
