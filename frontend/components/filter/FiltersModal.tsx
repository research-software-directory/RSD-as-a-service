// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import useSmallScreen from '~/config/useSmallScreen'

type FiltersModalProps={
  open: boolean,
  setModal:(open:boolean)=>void
  title?: string
  children?: JSX.Element | JSX.Element[]
}

export default function FiltersModal({open,setModal,children,title='Filters'}:FiltersModalProps) {
  const smallScreen = useSmallScreen()

  return (
    <Dialog
      fullScreen={smallScreen}
      open={open}
      aria-labelledby="filters-panel"
      aria-describedby="filters-panel-responsive"
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {/* the filter content component is added here */}
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={()=>setModal(false)}
          color="primary"
          // variant="contained"
        >
          Apply
        </Button>
        <Button
          onClick={()=>setModal(false)}
          color="secondary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
