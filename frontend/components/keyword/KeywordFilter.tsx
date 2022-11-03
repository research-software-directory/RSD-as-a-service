// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState, Fragment, useEffect} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import Popover from '@mui/material/Popover'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import FindKeyword, {Keyword} from '~/components/keyword/FindKeyword'

type SeachApiProps = {
  searchFor: string
}

type KeywordFilterProps = {
  items?: string[]
  onApply: (items: string[]) => void
  searchApi: ({searchFor}:SeachApiProps)=> Promise<Keyword[]>
}

/**
 * Keywords filter component. It receives array of keywords and returns
 * array of selected tags to use in filter using onSelect callback function
 */
export default function KeywordsFilter({items=[], searchApi, onApply}:KeywordFilterProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(items ?? [])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // console.group('KeywordsFilter')
  // console.log('selectedItems...', selectedItems)
  // console.log('open...', open)
  // console.groupEnd()
  useEffect(() => {

  },[])

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
        <section className="flex flex-wrap items-center px-4 pb-4 gap-2">
          {selectedItems.map((item, pos) => {
            if (pos > 0) {
              return (
                <Fragment key={pos}>
                  <span className="text-md">+</span>
                  <Chip
                    label={item}
                    onDelete={() => handleDelete(pos)}
                    sx={{
                      borderRadius:'0.25rem'
                    }}
                  />
                </Fragment>
              )
            }
            return (
              <Chip
                key={pos}
                label={item}
                onDelete={() => handleDelete(pos)}
                sx={{
                  borderRadius:'0.25rem'
                }}
              />
            )
          })}
        </section>
      )
    }
    // debugger
    return (
      <Alert severity="info" sx={{margin: '1rem'}}>
        <AlertTitle sx={{fontWeight: 500}}>Filter is not active</AlertTitle>
        Select the keyword from the list of most often used terms or <strong>start typing to search for the specific term</strong>.
      </Alert>
    )
  }

  return (
    <>
      <Tooltip title={`Filter: ${selectedItems.length>0 ? selectedItems.join(' + ') : 'None'}`}>
        <IconButton
          onClick={handleOpen}
          sx={{marginRight:'0.5rem'}}
        >
          <Badge badgeContent={selectedItems.length} color="primary">
            <FilterAltIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        // anchorReference="anchorPosition"
        // anchorPosition={{top: 0, left: 0}}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // align menu to the right from the menu button
        transformOrigin={{horizontal: 'center', vertical: 'top'}}
        anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: ['100vw', '24rem'],
          height: ['100vh', 'auto']
        }}
      >
        <h3 className="px-4 py-3 text-primary">
          Filter by keyword
        </h3>
        <Divider />
        <div className="px-4 py-4 w-[22rem]">
          <FindKeyword
            config={{
              freeSolo: false,
              minLength: 0,
              label: 'Find keyword',
              help: '',
              reset: true
            }}
            searchForKeyword={searchApi}
            onAdd={onAdd}
            // onCreate={onCreate}
          />
        </div>
        {renderSelectedItems()}
        <Divider />
        <div className="flex items-center justify-between px-4 py-2">
          <Button
            color="secondary"
            startIcon={<CloseIcon />}
            onClick={handleClear}>
            {selectedItems.length === 0 ? 'Close' : 'Clear'}
          </Button>
          <Button
            onClick={handleApply}
            startIcon={<CheckIcon />}
            disabled={selectedItems.length===0}
          >
            Apply
          </Button>
        </div>
      </Popover>
    </>
  )
}
