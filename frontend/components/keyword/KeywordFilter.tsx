// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

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
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import TagListItem from '~/components/layout/TagListItem'
import FindKeyword, {Keyword} from './FindKeyword'
import {searchForSoftwareKeyword} from '../software/edit/information/searchForSoftwareKeyword'

type KeywordFilterProps = {
  items?: string[]
  onApply: (items: string[]) => void
}

/**
 * Keywords filter component. It receives array of keywords and returns
 * array of selected tags to use in filter using onSelect callback function
 */
export default function KeywordsFilter({items=[], onApply}:KeywordFilterProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(items ?? [])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // console.group('KeywordsFilter')
  // console.log('selectedItems...', selectedItems)
  // console.log('open...', open)
  // console.groupEnd()


  function handleOpen(event: React.MouseEvent<HTMLElement>){
    setAnchorEl(event.currentTarget)
  }
  function handleClose(){
    setAnchorEl(null)
  }

  function handleClear(){
    setSelectedItems([])
    onApply([])
    handleClose()
  }

  function handleApply(){
    onApply(selectedItems)
    handleClose()
  }

  function handleDelete(pos:number) {
    const newList = [
      ...selectedItems.slice(0, pos),
      ...selectedItems.slice(pos+1)
    ]
    setSelectedItems(newList)
  }

  function onAdd(item: Keyword) {
    const find = selectedItems.find(keyword => keyword.toLowerCase() === item.keyword.toLowerCase())
    // new item
    if (typeof find == 'undefined') {
      const newList = [
        ...selectedItems,
        item.keyword
      ].sort()
      setSelectedItems(newList)
    }
  }

  function renderSelectedItems() {
    if (selectedItems && selectedItems.length > 0) {
      return (
        <section className="flex flex-wrap items-center px-4 pt-4 gap-2">
          {selectedItems.map((item, pos) => {
            if (pos > 0) {
              return (
                <div key={pos}>
                  <span className="text-md">+</span>
                  <Chip
                    label={item}
                    size="small"
                    onDelete={() => handleDelete(pos)}
                  />
                </div>
              )
            }
            return (
              <Chip
                key={pos}
                label={item}
                size="small"
                onDelete={() => handleDelete(pos)}
              />
            )
          })}
        </section>
      )
    }
    return null
  }

  return (
    <>
      <Tooltip title={`Filter: ${selectedItems.join(' + ')}`}>
        <IconButton onClick={handleOpen}>
          <Badge badgeContent={selectedItems.length} color="primary">
            <FilterAltIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // align menu to the right from the menu button
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        sx={{
          maxWidth:'24rem'
        }}
      >
        <h3 className="px-4 py-3 text-primary">
          Filter by keyword
        </h3>
        <Divider />
        {renderSelectedItems()}
        <section className="px-4 py-4 w-[22rem]">
          <FindKeyword
            config={{
              freeSolo: false,
              minLength: 1,
              label: 'Add keyword to filter',
              // help: 'Search for avilable keywords',
              help: '',
              reset: true
            }}
            searchForKeyword={searchForSoftwareKeyword}
            onAdd={onAdd}
            // onCreate={onCreate}
          />
        </section>
        <Divider />
        <div className="flex items-center justify-between px-4 py-2">
          <Button
            color="secondary"
            startIcon={<CloseIcon />}
            onClick={handleClear}>
            Clear
          </Button>
          <Button
            onClick={handleApply}
            startIcon={<PlayArrowIcon />}
            disabled={selectedItems.length===0}
          >
            Apply
          </Button>
        </div>
      </Popover>
    </>
  )
}
