// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Alert from '@mui/material/Alert'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import SaveIcon from '@mui/icons-material/Save'

import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry} from '~/types/Category'
import ContentLoader from '../layout/ContentLoader'
import {RecursivelyGenerateItems} from '~/components/software/TreeSelect'
import {useEffect, useState} from 'react'

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

  // console.group('CategoriesDialog')
  // console.log('state...', state)
  // console.log('selected...', selected)
  // console.log('selectedCategoryIds...',selectedCategoryIds)
  // console.groupEnd()

  useEffect(()=>{
    if (state==='ready'){
      setSelectedCategoryIds(selected)
    }
  },[selected,state])

  function isSelected(node: TreeNode<CategoryEntry>) {
    const val = node.getValue()
    return selectedCategoryIds.has(val.id)
  }

  function textExtractor(value: CategoryEntry) {
    return value.name
  }

  function keyExtractor(value: CategoryEntry) {
    return value.id
  }

  function onSelect(node: TreeNode<CategoryEntry>) {
    const val = node.getValue()
    if (selectedCategoryIds.has(val.id)) {
      selectedCategoryIds.delete(val.id)
    } else {
      selectedCategoryIds.add(val.id)
    }
    setSelectedCategoryIds(new Set(selectedCategoryIds))
  }

  function isSaveDisabled(){
    return categories === null || categories.length === 0 || state !== 'ready'
  }

  function renderDialogContent(): JSX.Element {
    switch (state) {
      case 'loading':
      case 'saving':
        return (
          <div className="flex-1 flex justify-center items-center">
            <ContentLoader/>
          </div>
        )

      case 'error':
        return (
          <Alert severity="error" sx={{marginTop: '0.5rem'}}>
            {errorMsg ?? '500 - Unexpected error'}
          </Alert>
        )

      case 'ready':
        return (
          <>
            {(categories === null || categories.length === 0)
              ?
              <Alert severity="info" sx={{'padding': '2rem'}}>
                {noItemsMsg}
              </Alert>
              :
              <RecursivelyGenerateItems
                nodes={categories}
                isSelected={isSelected}
                keyExtractor={keyExtractor}
                onSelect={onSelect}
                textExtractor={textExtractor}
              />
            }
          </>
        )
    }
  }

  return (
    <Dialog open fullScreen={smallScreen}>
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>{title}</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem 1.5rem 2.5rem !important',
        }}>

        {renderDialogContent()}

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
