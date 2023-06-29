// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import {SearchOrganisation} from '~/types/Organisation'
import Select, {SelectChangeEvent} from '@mui/material/Select'

type RorIdOptionsModalProps = {
  open: boolean
  options: AutocompleteOption<SearchOrganisation>[],
  onSelect: (ror_id:string)=>void
}

export default function RorIdOptionsModal({open,options,onSelect}:RorIdOptionsModalProps) {
  const [ror_id, setRorId] = useState<string>()

  useEffect(() => {
    if (options && options.length > 0) {
      // select first by default
      const ror = options[0].data.ror_id
      setRorId(ror ?? undefined)
    }
  },[options])

  function handleChange(event: SelectChangeEvent<typeof ror_id>){
    setRorId(event.target.value || '')
  }

  function handleClose(event: React.SyntheticEvent<unknown>, reason?: string) {
    if (reason !== 'backdropClick') {
      if (ror_id) {
        onSelect(ror_id)
      }
    }
  }

  function renderOptions() {
    return options.map(item => {
      if (item.data.ror_id) {
        return (
          <MenuItem
            key={item.key}
            value={item.data.ror_id}
          >
            {item.label}
          </MenuItem>
        )
      }
    })
  }

  return (
    <Dialog
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
    >
      <DialogTitle
        color='primary'
        sx={{
          fontSize:'2rem'
        }}
      >
        Find ROR id
      </DialogTitle>
      <DialogContent
        sx={{
          width:'30rem'
        }}
      >
        <p className="pb-8">
          Failed to find exact match on the organisation name in ROR database.
          Please select an organisation from the alternatives or use
          Cancel button to abort the process.
        </p>

        <Select
          labelId="demo-dialog-select-label"
          id="select-organisation"
          value={ror_id ?? ''}
          variant="standard"
          onChange={handleChange}
          sx={{
            width:'100%'
          }}
        >
          {renderOptions()}
        </Select>

      </DialogContent>
      <DialogActions
        sx={{
          padding:'1.5rem'
        }}
      >
        <Button
          onClick={handleClose}
          color="secondary"
          sx={{
            marginRight:'1rem'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleClose}>
          Select
        </Button>
      </DialogActions>
    </Dialog>
  )
}
