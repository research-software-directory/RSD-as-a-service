// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'

import CaretIcon from '~/components/icons/caret.svg'
import useDisableScrollLock from '~/utils/useDisableScrollLock'
import useAddItemMenu from './useAddItemMenu'

export default function AddMenu() {
  const router = useRouter()
  const disable = useDisableScrollLock()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const addItemMenu = useAddItemMenu()

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    // only one option so click direct to action
    if (addItemMenu.length===1 && addItemMenu[0]?.path){
      handleClose(addItemMenu[0]?.path)
    }else{
      // show menu items
      setAnchorEl(event.currentTarget)
    }
  }

  function handleClose(path?: string) {
    // push to route if provided
    if (path) {
      router.push(path)
    }
    setAnchorEl(null)
  }

  // console.group('AddMenu')
  // console.log('open...',open)
  // console.log('addItemMenu...',addItemMenu)
  // console.groupEnd()

  // if no items to shown hide it
  if (addItemMenu.length === 0) return null

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
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        // disable adding styles to body (overflow:hidden & padding-right)
        disableScrollLock={disable}
        slotProps={{
          list: {'aria-labelledby': 'menu-button'}
        }}
      >
        {
          addItemMenu.map(item=>{
            return (
              <MenuItem
                key={item.path}
                data-testid="add-menu-option"
                onClick={() => handleClose(item.path)}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                {item.label}
              </MenuItem>
            )
          })
        }
      </Menu>
    </>
  )
}
