// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'

import {useSession} from '~/auth'
import {CommunitiesOfSoftware} from './apiSoftwareCommunities'
import SoftwareCommunityListItem from './SoftwareCommunityListItem'
import {CategoryTreeLevel} from '~/components/category/CategoryTree'
import {genCategoryTreeNodes, useReorderedCategories} from '~/utils/categories'
import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry, CategoryID} from '~/types/Category'
import {useCallback, useEffect, useState} from 'react'
import {deleteCategoryToSoftware, getCategoriesForSoftware} from '~/utils/getSoftware'
import useSoftwareContext from '~/components/software/edit/useSoftwareContext'

type OrganisationListProps = {
  readonly communities: CommunitiesOfSoftware[]
  readonly onDelete: (id: string) => void
}

export default function SoftwareCommunityList({communities,onDelete}:OrganisationListProps) {
  const {user, token} = useSession()
  const {software} = useSoftwareContext()
  const softwareId = software.id
  const [categoryRoots, setCategoryRoots] = useState<TreeNode<CategoryEntry>[]>([])

  const loadCategories = useCallback(() => {
    getCategoriesForSoftware(softwareId, token)
      .then(paths => genCategoryTreeNodes(paths))
      .then(roots => setCategoryRoots(roots))
  }, [softwareId, token])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])


  if (communities.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No community membership</AlertTitle>
        Apply for community membership using <strong>search</strong>!
      </Alert>
    )
  }

  function deleteCategoryId(categoryId: CategoryID) {
    deleteCategoryToSoftware(softwareId, categoryId, token)
      .then(loadCategories)
  }

  return (
    <List>
      {
        communities.map(item =>{
          // software maintainer cannot remove rejected community status
          const userCanDelete = user?.role === 'rsd_admin' || item.status !=='rejected'
          const communityCategories: TreeNode<CategoryEntry>[] = categoryRoots
            .map(root => root.subTreeWhereLeavesSatisfy(value => value.community === item.id))
            .filter(arr => arr !== null) as TreeNode<CategoryEntry>[]
          return (
            <>
              <SoftwareCommunityListItem key={item.id} community={item} onDelete={userCanDelete ? onDelete : undefined} />
              <CategoryTreeLevel showLongNames items={communityCategories} onRemove={deleteCategoryId}/>
            </>
          )
        })
      }
    </List>
  )
}
