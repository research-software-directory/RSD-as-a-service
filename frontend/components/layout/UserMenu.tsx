import {useState} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar'

import {MenuItemType} from '../../config/menuItems'
import router from 'next/router';

type UserMenuType={
  name:string,
  image?:string
  menuOptions?:MenuItemType[]
}

export default function UserMenu(props:UserMenuType) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const {name, image, menuOptions} = props

  function handleClick(event: React.MouseEvent<HTMLButtonElement>){
    setAnchorEl(event.currentTarget);
  }

  function handleClose(item:MenuItemType){
    if (item?.fn){
      // call function if provided
      item.fn(item)
    } else if (item?.path){
      // push to route if provided
      router.push(item.path)
    }
    setAnchorEl(null);
  }

  function renderMenuOptions(){
    if (menuOptions){
      return (
        menuOptions.map(item=>{
          return (
            <MenuItem
              key={item.label}
              onClick={()=>handleClose(item)}>
                {item.label}
            </MenuItem>
          )
        })
      )
    }
  }

  return (
    <div>
      <Button
        aria-controls="user-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar 
          alt={name ?? "Unknown"} 
          src={image} 
        />
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}
      >
        {renderMenuOptions()}
      </Menu>
    </div>
  );
}