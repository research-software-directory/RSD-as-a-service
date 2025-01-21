// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState, JSX} from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Alert from '@mui/material/Alert'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import SaveIcon from '@mui/icons-material/Save'

import {useSession} from '~/auth'
import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry} from '~/types/Category'
import {CategoryForSoftwareIds} from '~/types/SoftwareTypes'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {getCategoryForSoftwareIds} from '~/utils/getSoftware'
import ContentLoader from '~/components/layout/ContentLoader'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import {RecursivelyGenerateItems} from '~/components/category/TreeSelect'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import {removeCommunityCategoriesFromSoftware} from '~/components/software/edit/communities/apiSoftwareCommunities'


export type communityAddCategoriesDialogProps = {
  readonly softwareId: string
  readonly community: CommunityListProps
  readonly onCancel: () => void
  readonly onConfirm: (community: CommunityListProps) => void
  readonly autoConfirm: boolean
}

export default function CommunityAddCategoriesDialog({
  softwareId,
  community,
  onCancel,
  onConfirm,
  autoConfirm
}: communityAddCategoriesDialogProps) {
  const {token} = useSession()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const [categories, setCategories] = useState<TreeNode<CategoryEntry>[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready' | 'saving'>('loading')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<CategoryForSoftwareIds>(new Set())
  const [availableCategoryIds, setAvailableCategoryIds] = useState<CategoryForSoftwareIds>(new Set())

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

  useEffect(() => {
    setState('loading')
    const promiseLoadRoots = loadCategoryRoots({community:community.id})
      .then(roots => {
        // if there are no categories for this community, we don't show the modal
        if (roots.length === 0 && autoConfirm) {
          onConfirm(community)
          return
        }
        const leaveIds = new Set<string>()
        for (const root of roots) {
          root.forEach(node => {
            if (node.children().length === 0) {
              leaveIds.add(node.getValue().id)
            }
          })
        }
        setAvailableCategoryIds(leaveIds)
        setCategories(roots)
      })

    const promiseLoadAssociatedCategories = getCategoryForSoftwareIds(softwareId, token)
      .then(setSelectedCategoryIds)

    Promise.all([promiseLoadRoots, promiseLoadAssociatedCategories])
      .then(() => {
        setState('ready')
      })
      .catch(e => {
        setError(`Couldn't load categories: ${e}`)
        setState('error')
      })
  }, [community, onConfirm, autoConfirm, softwareId, token])

  function isCancelEnabled() {
    return state === 'saving'
  }

  function isSaveDisabled(){
    return categories === null || categories.length === 0 || state !== 'ready'
  }

  async function saveCategoriesAndCommunity() {
    if (selectedCategoryIds.size === 0) {
      onConfirm(community)
      return
    }

    setState('saving')

    const deleteErrorMessage = await removeCommunityCategoriesFromSoftware(softwareId, community.id, token)
    if (deleteErrorMessage !== null) {
      setError(`Couldn't delete the existing categories: ${deleteErrorMessage}`)
      setState('error')
      return
    }

    const categoryUrl = `${getBaseUrl()}/category_for_software`
    const categoriesArrayToSave: {software_id: string, category_id: string}[] = []
    selectedCategoryIds
      .forEach(id => {
        if (availableCategoryIds.has(id)) {
          categoriesArrayToSave.push({software_id: softwareId, category_id: id})
        }
      })

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
      onConfirm(community)
    }
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
            {error}
          </Alert>
        )

      case 'ready':
        return (
          <>
            {(categories === null || categories.length === 0)
              ?
              <Alert severity="info" sx={{'padding': '2rem'}}>
                  This community doesn&lsquo;t have any categories.
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
      }}>Add categories of {community.name}</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: ['100%', '37rem'],
          padding: '1rem 1.5rem 2.5rem !important'
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
          disabled={isCancelEnabled()}
        >
          Cancel
        </Button>
        <Button
          id="save-button"
          variant="contained"
          tabIndex={0}
          onClick={saveCategoriesAndCommunity}
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
