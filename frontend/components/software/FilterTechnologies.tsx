import {useState, useEffect} from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import CloseIcon from '@mui/icons-material/Close'
import {TagItem} from '../../utils/getSoftware'

/**
 * Tags filter component. It receives array of TagItems and returns
 * array of selected tags to use in filter using onSelect callback function
 */
export default function FilterTechnologies({items=[], onSelect}:{items:TagItem[], onSelect:(items:string[])=>void}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  useEffect(()=>{
    const preselect = items.filter(i=>i.active===true).map(i=>i.tag)
    // set pre-selected items
    setSelectedItems(preselect)
  },[items])

  function handleClick(event: React.MouseEvent<HTMLElement>){
    setAnchorEl(event.currentTarget)
  }
  function handleClose(){
    setAnchorEl(null)
  }

  function handleClear(){
    setSelectedItems([])
    onSelect([])
    handleClose()
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
    // pass selected items back
    onSelect(newSelection)
  }

  // if no filter items don't show filter component
  if (items.length===0) return null

  return (
    <>
      <Tooltip title={`Filter: ${selectedItems.join(', ')}`}>
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
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
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
        <div className="flex items-center justify-between mx-4">
          <Button
            disabled={selectedItems?.length===0}
            color="secondary"
            sx={{mx:1}}
            onClick={handleClear}>
            <ClearAllIcon sx={{mr:1}}/>
            Clear
          </Button>
          <Button
            sx={{mx:1}}
            onClick={handleClose}>
            <CloseIcon sx={{mr:1}}/>
            Close
          </Button>
        </div>
        {/* <ListItemText sx={{textAlign:'center', textTransform:'uppercase'}}>
        </ListItemText> */}
      </Menu>
    </>
  )
}
