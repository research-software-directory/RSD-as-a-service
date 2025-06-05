// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useState,JSX} from 'react'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

export type IconBtnMenuOption<T> = {
  type: 'divider' | 'action'
  key: string,
  label: string,
  icon?: JSX.Element,
  action: T
  disabled?: boolean,
}

export type IconBtnMenuOnActionProps<T> = {
  options: IconBtnMenuOption<T>[]
  onAction: (action:T) => void
  IconComponent?: any
  sx?: any
}

export default function IconBtnMenuOnAction({
  options,
  onAction,
  // default icon is MoreVericalIcon
  IconComponent = MoreVertIcon,
  sx
}: IconBtnMenuOnActionProps<any>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
    event.stopPropagation()
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
              aria-label={item.label}
              onClick={() => handleAction(item.action)}>
              {item.icon ? <span className="mr-2">{item.icon}</span> : null}
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
        aria-label='Menu'
        aria-controls="more-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={handleClick}
        sx={sx}
      >
        <IconComponent/>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        slotProps={{
          list: {
            'aria-labelledby': 'menu-button',
          }
        }}
      >
        {renderMenuOptions()}
      </Menu>
    </>
  )
}
