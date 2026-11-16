// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import IconButton from '@mui/material/IconButton'
import AutoDeleteIcon from '@mui/icons-material/AutoDelete'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'

type DeleteOldLogs={
  disabled: boolean
  onDelete:(days:number)=>void
}

export default function DeleteOldLogsBtn({disabled,onDelete}:DeleteOldLogs) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  function DeleteItems(days:number){
    onDelete(days)
    handleClose()
  }
  return (
    <div>
      <IconButton
        title="Delete logs"
        disabled={disabled}
        sx={{
          alignSelf:'center',
          margin: '0.25rem 0.5rem 0rem 0.25rem'
        }}
        onClick={handleClick}
      >
        <AutoDeleteIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        slotProps={{
          list: {
            'aria-labelledby': 'fade-button',
          },
        }}
        slots={{transition: Fade}}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={()=>DeleteItems(30)}>&gt; 30 days</MenuItem>
        <MenuItem onClick={()=>DeleteItems(7)}>&gt; 7 days</MenuItem>
        <MenuItem onClick={()=>DeleteItems(0)}>Delete All</MenuItem>
      </Menu>
    </div>
  )
}
