// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
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
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <div className="flex py-8 flex-col gap-8">
          {/* the filter content component is added here */}
          {children}
        </div>
      </DialogContent>
      <DialogActions sx={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button
          onClick={()=>setModal(false)}
          color="secondary"
          sx={{marginRight:'2rem'}}
        >
          Cancel
        </Button>
        <Button
          onClick={()=>setModal(false)}
          color="primary"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  )
}
