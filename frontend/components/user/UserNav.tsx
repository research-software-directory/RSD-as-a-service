import {useRouter} from 'next/router'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {userMenu} from './UserNavItems'

export default function UserNav({selected,isMaintainer}:
  {selected:string, isMaintainer:boolean}) {
  const router = useRouter()
  const menuItems = Object.keys(userMenu)
  return (
    <nav>
      <List sx={{
        width:'100%'
      }}>
        {menuItems.map((key, pos) => {
          const item = userMenu[key]
          if (item.isVisible({
            isMaintainer
          }) === true) {
            return (
              <ListItemButton
                key={`step-${pos}`}
                selected={item.id === selected}
                onClick={() => {
                  // debugger
                  router.push(`/user/${key}`)
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label(100)} secondary={item.status} />
              </ListItemButton>
            )
          }
        })}
      </List>
    </nav>
  )
}
