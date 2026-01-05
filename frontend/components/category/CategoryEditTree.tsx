// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Add from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import {TreeNode} from '~/types/TreeNode'
import CategoryEditTreeNode from '~/components/category/CategoryEditTreeNode'
import {CategoryEntry} from '~/types/Category'
import CategoryEditForm, {CategoryEditFormLabels} from '~/components/category/CategoryEditForm'
import EditSectionTitle from '../layout/EditSectionTitle'

type CategoryEditTreeProps=Readonly<{
  roots: TreeNode<CategoryEntry>[],
  community: string | null
  organisation: string | null
  onMutation: ()=>void
  title?: string
  labels?: CategoryEditFormLabels
}>

export default function CategoryEditTree({roots, community, organisation, title, labels, onMutation}:CategoryEditTreeProps) {

  const [showAddChildForm, setShowAddChildForm] = useState<boolean>(false)

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
    <>
      <div className="flex justify-between">
        <EditSectionTitle
          title={title ?? ''}
        />
        <Button
          variant='contained'
          onClick={() => {
            setShowAddChildForm(true)
          }}
          disabled={showAddChildForm}
          startIcon={<Add />}
        >
          Add
        </Button>
      </div>
      <div className="flex-1">
        {showAddChildForm &&
        <CategoryEditForm
          createNew={true}
          community={community}
          organisation={organisation}
          data={null}
          onSuccess={onNewChildSuccess}
          onCancel={()=>setShowAddChildForm(false)}
          labels={labels}
        />
        }
        {roots.length > 0 ?
          roots
            .map(node => {
              return (
                <CategoryEditTreeNode
                  key={node.getValue().id}
                  node={node}
                  community={community}
                  organisation={organisation}
                  onDelete={onDeleteChild}
                  onMutation={onMutation}
                  labels={labels}
                />
              )})
          :
          !showAddChildForm &&
          <Alert severity="info" sx={{margin:'2rem 0rem'}}>
            There are no categories, add one using &quot;Add&quot; button above.
          </Alert>
        }
      </div>
    </>
  )
}
