// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import IconButton from '@mui/material/IconButton'
import Add from '@mui/icons-material/Add'
import Edit from '@mui/icons-material/Edit'
import Icon from '@mui/material/Icon'
import Delete from '@mui/icons-material/Delete'

import {useSession} from '~/auth/AuthProvider'
import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry} from '~/types/Category'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import CategoryEditForm, {CategoryEditFormLabels} from '~/components/category/CategoryEditForm'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'

export default function CategoryEditTreeNode({node, community, organisation, labels, onDelete, onMutation}: Readonly<{
  node: TreeNode<CategoryEntry>
  community: string | null
  organisation: string | null
  onDelete: (node: TreeNode<CategoryEntry>) => void
  onMutation: ()=>void
  labels?: CategoryEditFormLabels
}>) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [expandChildren, setExpandChildren] = useState<boolean>(false)
  const [categoryData, setCategoryData] = useState<CategoryEntry | null>(null)
  const [showItem, setShowItem] = useState<'add'|'edit'|'delete'|'none'>('none')

  useEffect(() => {
    setCategoryData(node.getValue())
  }, [node])

  if (categoryData === null) {
    return null
  }

  function onEditSuccess(newCategoryData: CategoryEntry) {
    setShowItem('none')
    setCategoryData(newCategoryData)
  }

  function onNewChildSuccess(newCategoryData: CategoryEntry) {
    node.addChild(new TreeNode(newCategoryData))
    setShowItem('none')
    setExpandChildren(true)
    onMutation()
  }

  async function deleteCategory(id: string) {
    const resp = await fetch(`/api/v1/category?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      },
    })
    if (!resp.ok) {
      showErrorMessage(`Couldn't delete the category, we got the following error: ${await resp.text()}`)
      return
    }

    onDelete(node)
  }

  function onDeleteChild(childNode: TreeNode<CategoryEntry>) {
    node.deleteChild(childNode)
    onMutation()
  }

  function getExpandIcon() {
    if (node.childrenCount() === 0) {
      return (
        <IconButton disabled>
          <Icon />
        </IconButton>
      )
    }
    else if (expandChildren) {
      return (
        <IconButton
          disabled={showItem!=='none'}
          onClick={() => setExpandChildren(false)}
        >
          <ExpandLess />
        </IconButton>
      )
    } else {
      return (
        <IconButton
          disabled={showItem!=='none'}
          onClick={() => setExpandChildren(true)}
        >
          <ExpandMore />
        </IconButton>
      )
    }
  }

  return (
    <>
      <List sx={{paddingLeft: '1rem'}}>
        <ListItem
          sx={{
            paddingRight: '12rem'
          }}
          onClick={() => setExpandChildren(!expandChildren)}
        >
          <ListItemText
            primary={categoryData.short_name}
            secondary={
              <>
                <span>{categoryData.name}</span>
                {/* only for top level item of organisation */}
                {organisation && categoryData.parent===null ?
                  <>
                    <br/>
                    <span className="pr-2">For software: {categoryData.allow_software ? 'Yes' : 'No'}</span>
                    <span>For projects: {categoryData.allow_projects ? 'Yes' : 'No'}</span>
                  </>
                  : null
                }
              </>
            }
          />
          <ListItemSecondaryAction sx={{
            display: 'flex',
            gap:'0.25rem'
          }}>
            <IconButton
              title={`Add category to ${categoryData.short_name}`}
              disabled={showItem!=='none'}
              onClick={() => {
                setShowItem('add')
              }}>
              <Add />
            </IconButton>
            <IconButton
              title={`Edit ${categoryData.short_name}`}
              disabled={showItem!=='none'}
              onClick={() => {
                setShowItem('edit')
              }}>
              <Edit />
            </IconButton>
            <IconButton
              title={`Delete ${categoryData.short_name}`}
              disabled={node.childrenCount() !== 0 || showItem!=='none'}
              onClick={() => {
                setShowItem('delete')
              }}>
              <Delete />
            </IconButton>
            {getExpandIcon()}
          </ListItemSecondaryAction>
        </ListItem>
        { showItem === 'edit' ?
          <CategoryEditForm
            createNew={false}
            community={community}
            organisation={organisation}
            data={categoryData}
            onSuccess={onEditSuccess}
            onCancel={()=>setShowItem('none')}
            labels={labels}
          />
          :null
        }
        { showItem === 'add' ?
          <CategoryEditForm
            createNew={true}
            community={community}
            organisation={organisation}
            data={categoryData}
            onSuccess={onNewChildSuccess}
            onCancel={()=>setShowItem('none')}
            labels={labels}
          />
          :null
        }
        {node.childrenCount() > 0 && <Collapse in={expandChildren}>
          {node.children()
            .map(child => {
              return (
                <CategoryEditTreeNode
                  key={child.getValue().id}
                  node={child}
                  community={community}
                  organisation={organisation}
                  onDelete={onDeleteChild}
                  onMutation={onMutation}
                  labels={labels}
                />
              )
            })}
        </Collapse>}
      </List>
      { showItem==='delete' ?
        <ConfirmDeleteModal open={true}
          title="Delete category"
          body={<p>Are you sure you want to delete &quot;{categoryData.short_name}&quot;?</p>}
          onCancel={() => setShowItem('none')}
          onDelete={() => {
            setShowItem('none')
            deleteCategory(categoryData.id)
          }}
        />
        :null
      }
    </>
  )
}
