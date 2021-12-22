import {useState} from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import SortIcon from '@mui/icons-material/Sort'
import ListItemText from '@mui/material/ListItemText'
import Badge from '@mui/material/Badge'
import CheckIcon from '@mui/icons-material/Check'


const paperStyles={
  elevation: 0,
  sx: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
}

export default function SortSelection({items=[], defaultValue, onSort}:
  {items:string[], defaultValue:string, onSort:(item:string)=>void}) {

  const [sortItem, setSortItem] = useState(defaultValue)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLElement>){
    setAnchorEl(event.currentTarget)
  }
  function handleClose(){
    setAnchorEl(null)
  }

  // if no filter items do not show filter options
  if (items.length===0) return null

  return (
    <>
      <Tooltip title={`Sort on: ${sortItem}`}>
        <IconButton
          onClick={handleClick}>
          <Badge badgeContent={1} color="secondary">
            <SortIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={paperStyles}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        {items.map((item) => (
          <MenuItem key={item} value={item}
            disabled={item !== defaultValue}
            onClick={()=>{
              // save localy
              setSortItem(item)
              // pass to parent
              onSort(item)
            }}>
            {
              sortItem === item ?
                <CheckIcon sx={{height:'1rem', marginRight:'0.5rem'}} />
                :
                <div style={{width:'2rem', textAlign:'center'}} />
            }
            <ListItemText primary={item} />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
