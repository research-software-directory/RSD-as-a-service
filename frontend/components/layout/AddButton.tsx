// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

type AddButtonProps={
  onAdd:()=>void
}

export default function AddButton({onAdd, ...props}:AddButtonProps) {
  return (
    <Button
      variant='contained'
      data-testid="add-btn"
      startIcon={<AddIcon />}
      onClick={onAdd}
      {...props}
    >
      Add
    </Button>
  )
}
