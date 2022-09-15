// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

export type IconBtnMenuOption<T> = {
  type: 'divider' | 'action'
  key: string,
  label: string,
  action: T
  disabled?: boolean,
}

export type IconBtnMenuOnActionProps<T> = {
  options: IconBtnMenuOption<T>[]
  onAction: (action:T) => void
  IconComponent?: any
}

export default function IconBtnMenuOnAction({options, onAction,
  // default icon is MoreVericalIcon
  IconComponent = MoreVertIcon}: IconBtnMenuOnActionProps<any>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleAction(action:any) {
    if (action) {
      onAction(action)
    }
    setAnchorEl(null)
  }

  function renderMenuOptions(){
    if (options){
      return (
        options.map(item => {
          if (item.type === 'divider') {
            return <Divider key={item.label} />
          }
          return (
            <MenuItem
              data-testid="icon-menu-option"
              key={item.label}
              onClick={()=>handleAction(item.action)}>
              {item.label}
            </MenuItem>
          )
        })
      )
    }
    return null
  }

  return (
    <>
      <IconButton
        size="large"
        data-testid="icon-menu-button"
        aria-controls="more-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={handleClick}
        sx={{
          color: 'inherit'
        }}
      >
        <IconComponent/>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        {renderMenuOptions()}
      </Menu>
    </>
  )
}
