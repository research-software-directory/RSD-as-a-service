// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import {showDialogAndGetFile} from '~/utils/handleFileUpload'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {ImageDataProps} from './Logo'

type AdminMenuLogoProps = {
  logo: string | null
  onAddLogo: (props:ImageDataProps) => void
  // onFileUpload: (e: ChangeEvent<HTMLInputElement> | undefined) => void
  onRemoveLogo: () => void
}

export default function LogoMenu({logo, onAddLogo, onRemoveLogo}: AdminMenuLogoProps) {
  const {showWarningMessage, showErrorMessage} = useSnackbar()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function onDelete() {
    // close menu
    handleClose()
    // pass request up
    onRemoveLogo()
  }

  async function onUpload() {
    // hide menu
    handleClose()
    // call file upload method
    const {status, message, image_b64, image_mime_type} = await showDialogAndGetFile()
    // console.group('onUpload')
    // console.log('status...', status)
    // console.log('message...', message)
    // console.log('image_b64...', image_b64)
    // console.log('image_mime_type...', image_mime_type)
    // console.groupEnd()
    // handle response
    if (status === 200 && image_b64 && image_mime_type) {
      onAddLogo({
        data: image_b64,
        mime_type: image_mime_type
      })
    } else if (status===413) {
      showWarningMessage(message)
    } else {
      showErrorMessage(message)
    }
  }

  return (
    <>
      <IconButton
        size="large"
        data-testid="icon-menu-button"
        aria-label="Logo options"
        aria-controls="more-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={handleClick}
        sx={{
          position: 'absolute',
          // backgroundColor: 'background.default',
          right: '0.25rem',
          top: '0.25rem',
          // opacity: 0.90,
          // '&:hover':{
          //   opacity: 1,
          //   backgroundColor: 'primary.light',
          //   color: 'primary.contrastText'
          // }
        }}
      >
        <MoreVertIcon/>
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
        <MenuItem
          title="Change logo"
          data-testid="icon-menu-option-upload"
          key="Upload"
          onClick={onUpload}
          sx={{
            color:'text.secondary'
          }}
        >
          <EditIcon />
        </MenuItem>
        <MenuItem
          data-testid="icon-menu-option-remove"
          title="Remove logo"
          key="Delete"
          disabled={logo===null}
          onClick={onDelete}
          sx={{
            color:'text.secondary'
          }}
        >
          <DeleteIcon/>
        </MenuItem>
      </Menu>
    </>
  )
}

