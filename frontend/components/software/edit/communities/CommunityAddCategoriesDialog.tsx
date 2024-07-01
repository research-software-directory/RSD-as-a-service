// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {useEffect, useState} from 'react'
import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry, CategoryID} from '~/types/Category'
import ContentLoader from '~/components/layout/ContentLoader'
import Alert from '@mui/material/Alert'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import TreeSelect from '~/components/software/TreeSelect'
import {CategoryForSoftwareIds} from '~/types/SoftwareTypes'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import {useSession} from '~/auth'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import {CategoryTreeLevel} from '~/components/category/CategoryTree'

export type communityAddCategoriesDialogProps = {
  readonly softwareId: string
  readonly community: CommunityListProps
  readonly onClose: () => void
  readonly onConfirm: () => void
}

export default function CommunityAddCategoriesDialog({
  softwareId,
  community,
  onClose,
  onConfirm
}: communityAddCategoriesDialogProps) {
  const [categories, setCategories] = useState<TreeNode<CategoryEntry>[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready' | 'saving'>('loading')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<CategoryForSoftwareIds>(new Set())

  const {token} = useSession()

  function isSelected(node: TreeNode<CategoryEntry>) {
    const val = node.getValue()
    return val === null ? false : selectedCategoryIds.has(val.id)
  }

  function textExtractor(value: CategoryEntry) {
    return value.name
  }

  function keyExtractor(value: CategoryEntry) {
    return value.id
  }

  function onSelect(node: TreeNode<CategoryEntry>) {
    const val = node.getValue()
    if (val === null) {
      return
    }
    if (selectedCategoryIds.has(val.id)) {
      selectedCategoryIds.delete(val.id)
    } else {
      selectedCategoryIds.add(val.id)
    }
    setSelectedCategoryIds(new Set(selectedCategoryIds))
  }

  const onRemove = (id: CategoryID) => {
    selectedCategoryIds.delete(id)
    setSelectedCategoryIds(new Set(selectedCategoryIds))
  }

  useEffect(() => {
    loadCategoryRoots(community.id)
      .then(roots => {
        setCategories(roots)
        setState('ready')
      })
      .catch(e => {
        setError(`Couldn't load categories: ${e}`)
        setState('error')
      })
  }, [community])

  const communityCategories: TreeNode<CategoryEntry>[] = categories === null ? [] : categories
    .map(root => root.subTreeWhereLeavesSatisfy(value => selectedCategoryIds.has(value.id)))
    .filter(arr => arr !== null) as TreeNode<CategoryEntry>[]

  async function saveCategoriesAndCommunity() {
    if (selectedCategoryIds.size === 0) {
      onConfirm()
      return
    }

    setState('saving')

    const categoryUrl = `${getBaseUrl()}/category_for_software`
    const categoriesArrayToSave: {software_id: string, category_id: string}[] = []
    selectedCategoryIds.forEach(id => categoriesArrayToSave.push({software_id: softwareId, category_id: id}))

    const resp = await fetch(categoryUrl, {
      method: 'POST',
      body: JSON.stringify(categoriesArrayToSave),
      headers: {
        ...createJsonHeaders(token)
      }
    })

    if (!resp.ok) {
      setError(`Couldn't save categories: ${await resp.text()}`)
      setState('error')
    } else {
      onConfirm()
    }
  }

  function renderDialogContent(): JSX.Element {
    switch (state) {
      case 'loading':
        return (
          <>
            <DialogContent>
              <ContentLoader/>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={onClose}>
                Cancel
              </Button>
            </DialogActions>
          </>
        )

      case 'error':
        return (
          <>
            <DialogContent>
              <Alert severity="error" sx={{marginTop: '0.5rem'}}>
                {error}
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={onClose}>
                Close
              </Button>
            </DialogActions>
          </>
        )

      case 'ready':
        return (
          <>
            <DialogContent>
              {(categories === null || categories.length === 0) &&
                'This community doesn\'t have any categories'
              }
              {categories !== null && categories.length > 0 &&
				  <TreeSelect
					  roots={categories}
					  isSelected={isSelected}
					  keyExtractor={keyExtractor}
					  onSelect={onSelect}
					  textExtractor={textExtractor}
				  />
              }
              <CategoryTreeLevel showLongNames items={communityCategories} onRemove={onRemove}/>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={saveCategoriesAndCommunity}>
                Save
              </Button>
              <Button onClick={onClose}>
                Cancel
              </Button>
            </DialogActions>
          </>
        )

      case 'saving':
        return (
          <DialogContent>
            <ContentLoader/>
          </DialogContent>
        )
    }
  }

  return (
    <Dialog open fullWidth>
      <DialogTitle>Add categories of {community.name}</DialogTitle>
      {renderDialogContent()}
    </Dialog>
  )
}
