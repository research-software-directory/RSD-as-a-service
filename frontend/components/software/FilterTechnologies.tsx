import {useState, useEffect} from 'react';
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
import {TagItem} from '../../utils/getSoftware'

/**
 * Tags filter component. It receives array of TagItems and returns
 * array of selected tags to use in filter using onSelect callback function
 */
export default function FilterTechnologies({items=[], onSelect}:{items:TagItem[], onSelect:(items:string[])=>void}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(()=>{
    const preselect = items.filter(i=>i.active===true).map(i=>i.tag)
    // set pre-selected items
    setSelectedItems(preselect)
  },[items])

  function handleClick(event: React.MouseEvent<HTMLElement>){
    setAnchorEl(event.currentTarget);
  }
  function handleClose(){
    setAnchorEl(null);
    // pass selected items back
    onSelect(selectedItems)
  }

  function handleClear(){
    // clear items
    setSelectedItems([])
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
        // align menu to the right from the menu button
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ListItemText sx={{textAlign:'center'}}>Technology</ListItemText>
        <Divider />
        {items.map((item) => (
          <MenuItem key={item.tag} value={item.tag}
            onClick={()=>toggleSelection(item.tag)}>
            <Checkbox
              checked={selectedItems.indexOf(item.tag) > -1}
            />
            <ListItemText primary={`${item.tag} (${item.count})`}/>
          </MenuItem>
        ))}
        <Divider />
        <ListItemText sx={{textAlign:'center', textTransform:'uppercase'}}>
          { selectedItems.length > 0 ?
            <>
            <Button
              color="secondary"
              sx={{marginRight:'2rem'}}
              onClick={handleClear}>
              Clear
            </Button>
            <Button
              onClick={handleClose}>
              Apply
            </Button>
            </>
            :
            <Button
              onClick={handleClose}>
              Close
            </Button>
          }
        </ListItemText>
      </Menu>
    </>
  );
}
