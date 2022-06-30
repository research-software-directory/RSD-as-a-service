// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {useRouter} from 'next/router'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'

import {MenuItemType} from '~/config/menuItems'
import {addMenuItems} from '~/config/addMenuItems'

export default function AddMenu() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose(item: MenuItemType) {
    if (item?.fn) {
      // call function if provided
      item.fn(item)
    } else if (item?.path) {
      // push to route if provided
      router.push(item.path)
    }
    setAnchorEl(null)
  }

  return (
    <div>
      <button
        data-testid="add-menu-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="group flex flex-nowrap items-center justify-center rounded-full w-12 h-12 mt-2"
      >
        <AddIcon className="text-white group-hover:text-primary"/>
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{'aria-labelledby': 'menu-button'}}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        {addMenuItems.map(item =>
          <MenuItem
            data-testid="add-menu-option"
            key={item.label}
            onClick={() => handleClose(item)}>
            {item.label}
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}
