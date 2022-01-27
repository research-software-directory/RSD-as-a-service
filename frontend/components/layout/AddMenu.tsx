import {useState} from 'react'
import {useRouter} from 'next/router'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'

import {MenuItemType} from '../../config/menuItems'
import {addMenuItems} from '../../config/addMenuItems'

export default function AddMenu() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>){
    setAnchorEl(event.currentTarget)
  }

  function handleClose(item:MenuItemType){
    if (item?.fn){
      // call function if provided
      item.fn(item)
    } else if (item?.path){
      // push to route if provided
      router.push(item.path)
    }
    setAnchorEl(null)
  }

  function renderMenuOptions(){
    if (addMenuItems){
      return (
        addMenuItems.map(item=>{
          return (
            <MenuItem
              data-testid="add-menu-option"
              key={item.label}
              onClick={()=>handleClose(item)}>
              {item.label}
            </MenuItem>
          )
        })
      )
    }
  }

  function isAddingDisabled() {
    switch (router?.pathname.toLowerCase()) {
      // adding new software should be disabled
      // during process of adding/editing an item
      case '/software/add':
      case '/software/[slug]/edit':
        return true
      default:
        return false
    }
  }

  return (
    <>
      <IconButton
        size="large"
        data-testid="add-menu-button"
        aria-controls="add-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={handleClick}
        disabled={isAddingDisabled()}
      >
        <AddIcon />
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
