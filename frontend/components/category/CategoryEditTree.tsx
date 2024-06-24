// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {TreeNode} from '~/types/TreeNode'
import CategoryEditTreeNode from '~/components/category/CategoryEditTreeNode'
import {CategoryEntry} from '~/types/Category'
import Add from '@mui/icons-material/Add'
import {useState} from 'react'
import CategoryEditForm from '~/components/category/CategoryEditForm'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

export default function CategoryEditTree({roots, community, onMutation}: {
  roots: TreeNode<CategoryEntry>[],
  community: string | null
  onMutation: Function
}) {

  const [showAddChildForm, setShowAddChildForm] = useState<boolean> (false)

  function onNewChildSuccess(newCategoryData: CategoryEntry) {
    roots.push(new TreeNode(newCategoryData))
    setShowAddChildForm(false)
    onMutation()
  }

  function onDeleteChild(childNode: TreeNode<CategoryEntry>) {
    const index = roots.indexOf(childNode)
    if (index >= 0) {
      roots.splice(index, 1)
    }
    onMutation()
  }

  return (
    <div className="flex-1">
      <Button
        variant='text'
        sx={{marginRight: '1rem'}}
        onClick={() => {
          setShowAddChildForm(!showAddChildForm)
        }}
        endIcon={<Add />}
      >
        Add top level category
      </Button>
      {showAddChildForm && <CategoryEditForm createNew={true} community={community} data={null} onSuccess={onNewChildSuccess}></CategoryEditForm>}
      {roots.length > 0 &&
        roots.filter(node => node.getValue() !== null)
          .map(node => {
            return <CategoryEditTreeNode node={node} community={community} key={node.getValue()!.id} onDelete={onDeleteChild} onMutation={onMutation}></CategoryEditTreeNode>
          })}
      {roots.length === 0 && <Alert severity="info">There are no categories yet, you add one with the button above.</Alert>}
    </div>
  )
}
