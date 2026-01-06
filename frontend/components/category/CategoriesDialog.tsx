// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import SaveIcon from '@mui/icons-material/Save'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry} from '~/types/Category'
import SearchInput from '../search/SearchInput'
import CategoriesDialogBody from './CategoriesDialogBody'

type CategoriesDialogProps={
  title: string,
  categories: TreeNode<CategoryEntry>[],
  selected: Set<string>,
  state: 'loading' | 'error' | 'ready' | 'saving',
  errorMsg: string | null
  noItemsMsg: string
  onCancel: ()=>void,
  onSave: (selected:Set<string>)=>void
}

export default function CategoriesDialog({
  title,categories,selected,
  state,errorMsg,noItemsMsg,
  onCancel,onSave
}:CategoriesDialogProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set())
  const [searchFor, setSearchFor] = useState<string>()

  // console.group('CategoriesDialog')
  // console.log('state...', state)
  // console.log('selected...', selected)
  // console.log('selectedCategoryIds...',selectedCategoryIds)
  // console.log('searchFor...', searchFor)
  // console.groupEnd()

  useEffect(()=>{
    if (state==='ready'){

      setSelectedCategoryIds(selected)
    }
  },[selected,state])

  function isSaveDisabled(){
    return categories === null || categories.length === 0 || state !== 'ready'
  }

  return (
    <Dialog
      open = {state !== 'loading'}
      fullScreen={smallScreen}
      sx={{
        '.MuiDialog-paper':{
          height: smallScreen ? '100%' : '70%',
          width: '100%'
        }
      }}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        {title}
      </DialogTitle>
      <div className="border-b flex py-2 px-6">
        <SearchInput
          placeholder='Find category'
          onSearch={setSearchFor}
          defaultValue={searchFor ?? ''}
          inputProps={{
            startAdornment:<InputAdornment position="start"><SearchIcon /></InputAdornment>
          }}
        />
      </div>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem 1.5rem 2.5rem !important',
        }}>

        <CategoriesDialogBody
          categories={categories}
          state={state}
          errorMsg={errorMsg}
          noItemsMsg={noItemsMsg}
          selectedCategoryIds={selectedCategoryIds}
          setSelectedCategoryIds={setSelectedCategoryIds}
          searchFor={searchFor}
        />

      </DialogContent>
      <DialogActions sx={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button
          tabIndex={1}
          onClick={onCancel}
          color="secondary"
          sx={{marginRight:'2rem'}}
        >
          Cancel
        </Button>
        <Button
          id="save-button"
          variant="contained"
          tabIndex={0}
          onClick={()=>{
            onSave(selectedCategoryIds)
          }}
          color="primary"
          endIcon={<SaveIcon />}
          disabled={isSaveDisabled()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
