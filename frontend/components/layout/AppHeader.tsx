import {useState, useEffect} from 'react'
import router from 'next/router'
import {useSession, signOut} from 'next-auth/react'

import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import IconButton from '@mui/material/IconButton'
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import RSDLogo from "./RSDLogo"
import MenuItem from './MenuItem'
import {menuItems} from '../../config/menuItems'

export default function AppHeader(){
  const [activePath, setActivePath] = useState("/")
  const {status} = useSession()

  useEffect(()=>{
    if (typeof window !='undefined'){
      const paths = window.location.pathname.split("/")
      if (paths.length > 0) setActivePath(`/${paths[1]}`)
    }
  },[])

  function getMenuItems(){
    return menuItems.map(item=>{
      // set active flag
      item.active = activePath === item.path
      return (
        <MenuItem
          key={item.path}
          item={item}
        />
      )
    })
  }

  function getLoginButton(){
    if (status==="authenticated"){
      return (
        <IconButton title="Logout"
          onClick={()=>signOut()}
        >
          <LogoutIcon color="secondary"></LogoutIcon>
        </IconButton>
      )
    }
    return (
      <IconButton title="Sign in / Sign up"
        onClick={()=>router.push('/login')}
      >
        <LoginIcon color="primary"></LoginIcon>
      </IconButton>
    )
  }

  return (
    <Container
      component="header"
      maxWidth="hd"
      sx={{
        position: 'sticky',
        display: 'flex',
        top: '0rem',
        height: '7rem',
        padding: '0rem 1.25rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'background.paper',
        zIndex: 8
      }}
    >
      <RSDLogo />
      <Box component="nav"
        sx={{
          display: 'flex',
        }}>
        {getMenuItems()}
      </Box>
      {getLoginButton()}
    </Container>
  )
}