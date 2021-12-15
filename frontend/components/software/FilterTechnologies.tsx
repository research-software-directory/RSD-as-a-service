import {useState} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button'

export default function FilterTechnologies({items=[], onSelect}:{items:string[], onSelect:(items:string[])=>void}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>){
    setAnchorEl(event.currentTarget);
  }
  function handleClose(){
    setAnchorEl(null);
    onSelect(selectedItems)
  }

  function toggleSelection(item:string){
    let newSelection = []
    if (selectedItems.indexOf(item) > -1){
      // remove from selection
      newSelection = selectedItems.filter(i=>i!==item)
    } else {
      newSelection=[
        ...selectedItems,
        item
      ]
    }
    setSelectedItems(newSelection)
  }

  // if no filter items don't show filter component
  if (items.length===0) return null

  return (
    <>
      <Tooltip title={`Filter: ${selectedItems.join(", ")}`}>
        <IconButton onClick={handleClick}>
          <Badge badgeContent={selectedItems.length} color="primary">
            <FilterAltIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // right align menu from the menu button
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ListItemText sx={{textAlign:'center'}}>Technology</ListItemText>
        <Divider />
        {items.map((item) => (
          <MenuItem key={item} value={item}
            onClick={()=>toggleSelection(item)}>
            <Checkbox
              checked={selectedItems.indexOf(item) > -1}
            />
            <ListItemText primary={item} />
          </MenuItem>
        ))}
        <Divider />
        <ListItemText sx={{textAlign:'center', textTransform:'uppercase'}}>
          <Button
            sx={{width:'100%'}}
            onClick={handleClose}>
            Apply
          </Button>
        </ListItemText>
        {/* <MenuItem
          onClick={handleClose}>
          <ListItemText sx={{textAlign:'center'}}>Apply filters</ListItemText>
        </MenuItem> */}
      </Menu>
    </>
  );
}
