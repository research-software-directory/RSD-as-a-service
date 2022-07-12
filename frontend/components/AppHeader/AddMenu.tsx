// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {useRouter} from 'next/router'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import {IconButton, ListItemIcon} from '@mui/material'

export default function AddMenu() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose(path?: string) {
    // push to route if provided
    if (path) {
      router.push(path)
    }
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        title="Add information"
        className="group"
        size="large"
        data-testid="add-menu-button"
        aria-controls="add-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={handleClick}
        sx={{
          color: 'primary.contrastText',
          margin:'0rem 0.5rem',
          '&:hover': {
            color: 'primary.main'
          },
          alignSelf: 'center',
          '&:focus-visible': {
            outline: 'auto'
          }
        }}
      >
        <AddIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{'aria-labelledby': 'menu-button'}}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        <MenuItem data-testid="add-menu-option" onClick={() => handleClose('/software/add')}>
          <ListItemIcon>
            <TerminalIcon/>
          </ListItemIcon>
          New Software
        </MenuItem>

        <MenuItem data-testid="add-menu-option" onClick={() => handleClose('/projects/add')}>
          <ListItemIcon>
            <ListAltIcon/>
          </ListItemIcon>
          New Project
        </MenuItem>
      </Menu>
    </>
  )
}
