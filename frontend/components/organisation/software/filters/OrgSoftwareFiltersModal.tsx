// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import OrgSoftwareFilters from './OrgSoftwareFilters'

type SoftwareFiltersModalProps = {
  open: boolean,
  setModal:(open:boolean)=>void
}

export default function OrgSoftwareFiltersModal({
  open, setModal
}:SoftwareFiltersModalProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')
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
        Filters
      </DialogTitle>
      <DialogContent>
        <div className="flex py-8 flex-col gap-8">
          <OrgSoftwareFilters />
        </div>
      </DialogContent>
      <DialogActions sx={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button
          onClick={()=>setModal(false)}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
