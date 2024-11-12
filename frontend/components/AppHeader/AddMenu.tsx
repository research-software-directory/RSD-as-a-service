// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {useRouter} from 'next/router'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import NewspaperIcon from '@mui/icons-material/Newspaper'

import {useSession} from '~/auth'
import CaretIcon from '~/components/icons/caret.svg'
import useDisableScrollLock from '~/utils/useDisableScrollLock'

export default function AddMenu() {
  const {user} = useSession()
  const router = useRouter()
  const disable = useDisableScrollLock()
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
          '&:hover': {
            color: 'primary.main'
          },
          alignSelf: 'center',
          '&:focus-visible': {
            outline: 'auto'
          }
        }}
      >
        <AddIcon/>
        <CaretIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{'aria-labelledby': 'menu-button'}}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        // disable adding styles to body (overflow:hidden & padding-right)
        disableScrollLock={disable}
      >
        <MenuItem data-testid="add-menu-option" onClick={() => handleClose('/add/software')}>
          <ListItemIcon>
            <TerminalIcon/>
          </ListItemIcon>
          New Software
        </MenuItem>

        <MenuItem data-testid="add-menu-option" onClick={() => handleClose('/add/project')}>
          <ListItemIcon>
            <ListAltIcon/>
          </ListItemIcon>
          New Project
        </MenuItem>
        {
          // ADMIN ONLY options
          user?.role==='rsd_admin' ?
            <MenuItem data-testid="add-menu-option" onClick={() => handleClose('/add/news')}>
              <ListItemIcon>
                <NewspaperIcon/>
              </ListItemIcon>
              Add News
            </MenuItem>
            : null
        }
      </Menu>
    </>
  )
}
