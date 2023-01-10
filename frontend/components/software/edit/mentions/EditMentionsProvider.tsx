// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
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
import {addNewMentionToSoftware, addToMentionForSoftware, removeMentionForSoftware} from './mentionForSoftwareApi'
import {MentionItemProps} from '~/types/Mention'
import {getMentionType} from '~/components/mention/config'
import {deleteMentionItem, updateMentionItem} from '~/utils/editMentions'
import NoMentionItems from './NoMentionItems'
import logger from '~/utils/logger'
import {useSession} from '~/auth'

const initalState:EditMentionState = {
  settings: {
    editModalTitle: 'Mention',
    confirmDeleteModalTitle: 'Delete mention',
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
  const {user} = useSession()
  const {showErrorMessage,showSuccessMessage,showInfoMessage} = useSnackbar()
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
    const item:MentionItemProps = action.payload
    // new item created manually
    if (item.id === null || item.id === '') {
      item.id = null
      item.source = 'RSD'
      // new item to be added
      const resp = await addNewMentionToSoftware({
        item,
        software,
        token
      })
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
    } else if (user?.role === 'rsd_admin') {
      // rsd_admin can update mention
      const resp = await updateMentionItem({
        mention: item,
        token,
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to update ${item.title}. ${resp.message}`)
        return
      }
      dispatch({
        type: EditMentionActionType.UPDATE_ITEM,
        // item is returned in message
        payload: resp.message
      })
    }
  }

  async function processOnAdd(action: EditMentionAction) {
    const item: MentionItemProps = action.payload
    // check if already in collection
    if (item.doi) {
      const found = state.mentions.find(mention=>mention.doi===item.doi)
      if (found) {
        showInfoMessage(`Mention with DOI ${item.doi} is already in ${getMentionType(item.mention_type,'plural')}.`)
        return true
      }
    }
    if (item.id) {
      // existing RSD mention item to be added to project
      const resp = await addToMentionForSoftware({
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
      // probably new item from crossref or datacite
      const resp = await addNewMentionToSoftware({item, software, token})
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

  // WE do not allow update of mentions with DOI from FE
  // Dusan 2022-10-19
  // async function processOnUpdate(action: EditMentionAction) {
  //   debugger
  //   const rsdItem = action.payload
  //   const resp = await updateDoiItem({
  //     rsdItem,
  //     token
  //   })
  //   if (resp.status == 200 && rsdItem) {
  //     dispatch({
  //       type: EditMentionActionType.UPDATE_ITEM,
  //       // item is returned in message
  //       payload: resp.message
  //     })
  //   } else {
  //     showErrorMessage(`Failed to update ${rsdItem.title}. ${resp.message}`)
  //   }
  // }

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
        // try to remove mention item
        // we do not handle response result
        // because if mention is referenced in other
        // software the delete action will fail (and that's ok)
        const del = await deleteMentionItem({
          id: item.id,
          token
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
        // WE do not allow update of mentions with DOI
        // Dusan 2022-10-19
        logger('ON_UPDATE action not supported','warn')
        // pass original action
        dispatch(action)
        // process item by api
        // processOnUpdate(action)
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
