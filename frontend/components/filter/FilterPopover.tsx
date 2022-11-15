// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import Divider from '@mui/material/Divider'
import useDisableScrollLock from '~/utils/useDisableScrollLock'

type FilterPopoverProps = {
  title: string
  filterTooltip: string
  badgeContent: number
  disableClear: boolean
  children: any
  onClear: () => void
}

/**
 * FilterPopover shared component for software and project filters.
 * It handles opening/closing of filter popover using filter icon.
 * The content of the popover is received via children prop.
 */
export default function FilterPopover(props: FilterPopoverProps) {
  const disable = useDisableScrollLock()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const {
    title, filterTooltip, badgeContent,
    disableClear, children, onClear
  } = props

  function handleOpen(event: React.MouseEvent<HTMLElement>){
    setAnchorEl(event.currentTarget)
  }
  function handleClose(){
    setAnchorEl(null)
  }

  function handleClear() {
    // close popover
    setAnchorEl(null)
    // pass clear event
    onClear()
  }

  return (
    <>
      <Tooltip title={filterTooltip}>
        <IconButton
          onClick={handleOpen}
          sx={{marginRight:'0.5rem'}}
        >
          <Badge badgeContent={badgeContent} color="primary">
            <FilterAltIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // align menu to the right from the menu button
        transformOrigin={{horizontal: 'center', vertical: 'top'}}
        anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '24rem',
          '.MuiPaper-root': {
            minWidth: '21rem',
            maxWidth: 'calc(100% - 4rem)'
          },
          '.MuiAlert-root': {
            minWidth: '19rem',
            maxWidth: 'calc(100% - 4rem)'
          }
        }}
        // disable adding styles to body (overflow:hidden & padding-right)
        // for mobile phone
        disableScrollLock={disable}
      >
        <h3 className="p-4">
          {title}
        </h3>
        <Divider />
        {/* POPOVER BODY */}
        {children}

        {/* POPOVER NAV */}
        <Divider />
        <div className="flex items-center justify-between px-4 py-2">
          <Button
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
            disabled={disableClear}
          >
            Clear
          </Button>
          <Button
            onClick={handleClose}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </div>
      </Popover>
    </>
  )
}
