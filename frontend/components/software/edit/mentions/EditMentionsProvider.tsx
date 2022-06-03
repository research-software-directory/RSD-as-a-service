// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useReducer} from 'react'

import useSnackbar from '~/components/snackbar/useSnackbar'
import {
  EditMentionAction, EditMentionActionType,
  editMentionReducer, EditMentionState
} from '~/components/mention/editMentionReducer'
import EditMentionContext from '~/components/mention/editMentionContext'
import {addMention2Item, addMentionToSoftware, removeMentionForSoftware} from './mentionForSoftwareApi'
import {MentionItemProps} from '~/types/Mention'
import {getMentionType} from '~/components/mention/config'
import {updateDoiItem, updateMentionItem} from '~/utils/editMentions'
import NoMentionItems from './NoMentionItems'

const initalState:EditMentionState = {
  settings: {
    editModalTitle: 'Mention',
    cofirmDeleteModalTitle: 'Delete mention',
    noItemsComponent:()=><NoMentionItems/>
  },
  loading: true,
  processing: false,
  mentions: [],
  editModal: {
    open:false
  },
  confirmModal: {
    open:false
  }
}

function createSuccessMessage(item:MentionItemProps) {
  let message = `Added ${item.title}`
  if (item.mention_type) {
    message += ` to ${getMentionType(item.mention_type,'plural')}`
  }
  return message
}

export default function EditMentionsProvider(props: any) {
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  // extract needed info from props
  const {token, software} = props
  const [state, dispatch] = useReducer(
    editMentionReducer,
    initalState
  )

  // console.group('EditMentionsProvider')
  // console.log('software...', software)
  // console.groupEnd()

  async function processOnSubmit(action: EditMentionAction) {
    const item = action.payload
    // new item created manually
    if (item.id === null || item.id === '') {
      item.id = null
      item.source = 'manual'
      // new item to be added
      const resp = await addMention2Item({item, software, token})
      // debugger
      if (resp.status === 200) {
        dispatch({
          type: EditMentionActionType.ADD_ITEM,
          // updated item is in message
          payload: resp.message
        })
        // show success
        showSuccessMessage(createSuccessMessage(resp.message as MentionItemProps))
      } else {
        showErrorMessage(resp.message as string)
      }
    } else {
      // this is existing item
      // we just need to update it
      const resp = await updateMentionItem({
        mention:item,
        token
      })
      if (resp.status === 200) {
        dispatch({
          type: EditMentionActionType.UPDATE_ITEM,
          // item is returned in message
          payload: resp.message
        })
      } else {
        showErrorMessage(`Failed to save ${item.title}. ${resp.message}`)
      }
    }
  }

  async function processOnAdd(action: EditMentionAction) {
    const item = action.payload
    if (item.id && item.source === 'RSD') {
      // existing RSD mention item to be added to project
      const resp = await addMentionToSoftware({
        software,
        mention: item.id,
        token
      })
      // debugger
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add ${item.title}. ${resp.message}`)
      } else {
        dispatch({
          type: EditMentionActionType.ADD_ITEM,
          payload: item
        })
        // show success
        showSuccessMessage(createSuccessMessage(item))
      }
    } else {
      // new item from crossref or datacite (source)
      const resp = await addMention2Item({item, software, token})
      // debugger
      if (resp.status === 200) {
        dispatch({
          type: EditMentionActionType.ADD_ITEM,
          // updated item is in message
          payload: resp.message
        })
        // show success
        showSuccessMessage(createSuccessMessage(resp.message as MentionItemProps))
      } else {
        showErrorMessage(resp.message as string)
      }
    }
  }

  async function processOnUpdate(action: EditMentionAction) {
    const rsdItem = action.payload
    const resp = await updateDoiItem({
      rsdItem,
      token
    })
    if (resp.status == 200 && rsdItem) {
      dispatch({
        type: EditMentionActionType.UPDATE_ITEM,
        // item is returned in message
        payload: resp.message
      })
    } else {
      showErrorMessage(`Failed to update ${rsdItem.title}. ${resp.message}`)
    }
  }

  async function processOnDelete(action: EditMentionAction) {
    const item = action.payload
    if (item.id) {
      const resp = await removeMentionForSoftware({
        software,
        mention: item.id,
        token
      })
      if (resp.status == 200) {
        dispatch({
          type: EditMentionActionType.DELETE_ITEM,
          // item is returned in message
          payload: item
        })
      } else {
        showErrorMessage(`Failed to delete ${item.title}. ${resp.message}`)
      }
    } else {
      showErrorMessage(`Failed to delete ${item.title}. Invalid item id ${item.id}`)
    }
  }

  /**
   * Middleware function that intercepts actions/messages send by mention module components
   * or local components which use useMentionReducer hook. This middleware function is used
   * to call other functions that perform api calls. In most cases we pass original
   * action/message further to other listeners/subscribers.
   * @param action
   */
  function dispatchMiddleware(action: EditMentionAction) {
    // console.log('impactMiddleware...action...', action)
    switch (action.type) {
      case EditMentionActionType.ON_SUBMIT:
        // pass original action
        dispatch(action)
        // process item by api
        // and dispatch next action (see function)
        processOnSubmit(action)
        break
      case EditMentionActionType.ON_ADD:
        // pass original action
        dispatch(action)
        // process item by api
        processOnAdd(action)
        break
      case EditMentionActionType.ON_UPDATE:
        // pass original action
        dispatch(action)
        // process item by api
        processOnUpdate(action)
        break
      case EditMentionActionType.ON_DELETE:
        // pass original action
        dispatch(action)
        // process item by api
        processOnDelete(action)
        break
      default:
        // just dispatch original action
        dispatch(action)
    }
  }

  return (
    <EditMentionContext.Provider
      value={{state, dispatch:dispatchMiddleware}}
      {...props}
    />
  )
}
