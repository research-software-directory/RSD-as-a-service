// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry} from '~/types/Category'
import {useEffect, useState} from 'react'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import IconButton from '@mui/material/IconButton'
import Add from '@mui/icons-material/Add'
import Edit from '@mui/icons-material/Edit'
import Icon from '@mui/material/Icon'
import CategoryEditForm from '~/components/category/CategoryEditForm'
import Delete from '@mui/icons-material/Delete'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'

export default function CategoryEditTreeNode({node, community, onDelete, onMutation}: {
  node: TreeNode<CategoryEntry>
  community: string | null
  onDelete: (node: TreeNode<CategoryEntry>) => void
  onMutation: Function
}) {
  const [expandChildren, setExpandChildren] = useState<boolean> (false)
  const [showEditForm, setShowEditForm] = useState<boolean> (false)
  const [showAddChildForm, setShowAddChildForm] = useState<boolean> (false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean> (false)
  const [categoryData, setCategoryData] = useState<CategoryEntry | null> (null)
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()

  useEffect(() => {
    setCategoryData(node.getValue())
  }, [node])

  if (categoryData === null) {
    return null
  }

  function onEditSuccess(newCategoryData: CategoryEntry) {
    setShowEditForm(false)
    setCategoryData(newCategoryData)
  }

  function onNewChildSuccess(newCategoryData: CategoryEntry) {
    node.addChild(new TreeNode(newCategoryData))
    setShowAddChildForm(false)
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
        <IconButton onClick={() => setExpandChildren(false)}>
          <ExpandLess />
        </IconButton>
      )
    } else {
      return (
        <IconButton onClick={() => setExpandChildren(true)}>
          <ExpandMore />
        </IconButton>
      )
    }
  }

  return (
    <>
      <List sx={{paddingLeft: '1rem'}}>
        <ListItem sx={{pr: '9rem'}} onClick={() => setExpandChildren(!expandChildren)}>
          <ListItemText primary={categoryData.short_name} secondary={categoryData.name} />
          <ListItemSecondaryAction>
            <IconButton
              sx={{backgroundColor: showAddChildForm ? 'primary.main' : undefined, color: showAddChildForm ? 'primary.contrastText' : undefined}}
              onClick={() => {
                setShowAddChildForm(!showAddChildForm)
                setShowEditForm(false)
              }}>
              <Add />
            </IconButton>
            <IconButton
              sx={{backgroundColor: showEditForm ? 'primary.main' : undefined, color: showEditForm ? 'primary.contrastText' : undefined}}
              onClick={() => {
                setShowEditForm(!showEditForm)
                setShowAddChildForm(false)
              }}>
              <Edit />
            </IconButton>
            <IconButton
              disabled={node.childrenCount() !== 0}
              onClick={() => {
                setShowDeleteModal(true)
              }}>
              <Delete />
            </IconButton>
            {getExpandIcon()}
          </ListItemSecondaryAction>
        </ListItem>
        {showEditForm && <CategoryEditForm createNew={false} community={community} data={categoryData} onSuccess={onEditSuccess}></CategoryEditForm>}
        {showAddChildForm && <CategoryEditForm createNew={true} community={community} data={categoryData} onSuccess={onNewChildSuccess}></CategoryEditForm>}
        {node.childrenCount() > 0 && <Collapse in={expandChildren}>
          {node.children()
            .filter(child => child.getValue() !== null)
            .map(child => {
              return (
                <CategoryEditTreeNode key={child.getValue()?.id} node={child} community={community} onDelete={onDeleteChild} onMutation={onMutation} />
              )
            })}
        </Collapse>}
      </List>
      {showDeleteModal && <ConfirmDeleteModal open={true}
        title="Delete category"
        body={<p>Are you sure you want to delete &quot;{categoryData.short_name}&quot;?</p>}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={() => {
          setShowDeleteModal(false)
          deleteCategory(categoryData.id)
        }}
      />
      }
    </>
  )
}
