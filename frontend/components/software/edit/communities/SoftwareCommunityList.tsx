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
import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry, CategoryID} from '~/types/Category'
import {addCategoryToSoftware, deleteCategoryToSoftware} from '~/utils/getSoftware'
import useSoftwareContext from '~/components/software/edit/useSoftwareContext'
import TreeSelect from '~/components/software/TreeSelect'
import {CategoryForSoftwareIds} from '~/types/SoftwareTypes'

type OrganisationListProps = {
  readonly communities: CommunitiesOfSoftware[]
  readonly onDelete: (id: string) => void
  readonly categoriesPerCommunity: Map<string, TreeNode<CategoryEntry>[]>
  readonly associatedCategoryIds: CategoryForSoftwareIds
  readonly onMutation: () => void
}

export default function SoftwareCommunityList({communities, onDelete, categoriesPerCommunity, associatedCategoryIds, onMutation}: OrganisationListProps) {
  const {user, token} = useSession()
  const {software} = useSoftwareContext()
  const softwareId = software.id

  function textExtractor(value: CategoryEntry) {
    return value.name
  }

  function keyExtractor(value: CategoryEntry) {
    return value.id
  }

  function addOrDeleteCategory(node: TreeNode<CategoryEntry>): void {
    const val = node.getValue()
    if (val === null) {
      return
    }

    const categoryId = val.id
    if (associatedCategoryIds.has(categoryId)) {
      deleteCategoryToSoftware(softwareId, categoryId, token)
        .then(onMutation)
    } else {
      addCategoryToSoftware(softwareId, categoryId, token)
        .then(onMutation)
    }
  }

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
      .then(onMutation)
  }

  return (
    <List>
      {
        communities.map(item => {
          // software maintainer cannot remove rejected community status
          const userCanDelete = user?.role === 'rsd_admin' || item.status !=='rejected'
          const categoriesForCommunity: TreeNode<CategoryEntry>[] = categoriesPerCommunity.get(item.id) ?? []
          const selectedCommunityCategories = categoriesForCommunity
            .map(root => root.subTreeWhereLeavesSatisfy(value => associatedCategoryIds.has(value.id)))
            .filter(arr => arr !== null) as TreeNode<CategoryEntry>[]
          return (
            <>
              <SoftwareCommunityListItem key={item.id} community={item} onDelete={userCanDelete ? onDelete : undefined} />
              {categoriesForCommunity.length > 0 &&
                <TreeSelect
                  roots={categoriesForCommunity}
                  isSelected={(node) => {const val = node.getValue(); return val !== null && associatedCategoryIds.has(val.id)}}
                  keyExtractor={keyExtractor}
                  onSelect={addOrDeleteCategory}
                  textExtractor={textExtractor}
                />
              }
              <CategoryTreeLevel showLongNames items={selectedCommunityCategories} onRemove={deleteCategoryId}/>
            </>
          )
        })
      }
    </List>
  )
}
