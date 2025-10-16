// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useReducer} from 'react'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {deleteMentionItem, updateMentionItem} from '~/components/mention/apiEditMentions'
import {MentionItemProps} from '~/types/Mention'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {
  EditMentionAction, EditMentionActionType,
  editMentionReducer, EditMentionState
} from '~/components/mention/editMentionReducer'
import EditMentionContext from '~/components/mention/editMentionContext'
import useSoftwareContext from '../../context/useSoftwareContext'
import {
  addToReferencePaperForSoftware,
  addNewReferencePaperToSoftware,
  removeReferencePaperForSoftware
} from './apiReferencePapers'
import NoReferencePapers from './NoReferencePapers'
import {useSoftwareMentionContext} from '../SoftwareMentionContext'
import SanitizedMathMLBox from '~/components/layout/SanitizedMathMLBox'

const initalState:EditMentionState = {
  settings: {
    editModalTitle: 'Reference papers',
    confirmDeleteModalTitle: 'Delete reference paper',
    noItemsComponent:()=><NoReferencePapers/>
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

export default function EditReferencePapersProvider(props:any) {
  const {user,token} = useSession()
  const {software:{id:software}} = useSoftwareContext()
  const {showErrorMessage,showSuccessMessage,showInfoMessage} = useSnackbar()
  const {loading,reference_papers:mentions,counts:{reference_papers},setReferencePapersCnt} = useSoftwareMentionContext()
  // initialize state with loading and items received from the parent.
  const [state, dispatch] = useReducer(editMentionReducer,{
    ...initalState,
    loading,
    mentions
  })

  useEffect(()=>{
    let abort = false
    if (abort===false){
      /**
       * Update EditMentionContext with
       * the values from ProjectMentionContext
       */
      // debugger
      dispatch({
        type: EditMentionActionType.SET_MENTIONS,
        // item is returned in message
        payload: mentions
      })
      dispatch({
        type: EditMentionActionType.SET_LOADING,
        // item is returned in message
        payload: loading
      })
    }
    return ()=>{abort=true}
  },[loading, mentions])

  // console.group('EditReferencePapersProvider')
  // console.log('software...', software)
  // console.log('state...', state)
  // console.groupEnd()

  async function processOnSubmit(action: EditMentionAction) {
    const item:MentionItemProps = action.payload
    // new item created manually
    if (item.id === null || item.id === '') {
      item.id = null
      item.source = 'RSD'
      // new item to be added
      const resp = await addNewReferencePaperToSoftware({
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
        showSuccessMessage(
          <SanitizedMathMLBox
            component="span"
            rawHtml={`Added ${item.title}`}
          />
        )
        // increase count
        setReferencePapersCnt(reference_papers+1)
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
        showErrorMessage(
          <SanitizedMathMLBox
            component="span"
            rawHtml={`Failed to update ${item.title}. ${resp.message}`}
          />
        )
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
        showInfoMessage(`Reference paper with DOI ${item.doi} is already in the list.`)
        return true
      }
    }
    if (item.id) {
      // existing RSD mention item to be added to software
      const resp = await addToReferencePaperForSoftware({
        software,
        mention: item.id,
        token
      })
      // debugger
      if (resp.status !== 200) {
        showErrorMessage(
          <SanitizedMathMLBox
            component="span"
            rawHtml={`Failed to add ${item.title}. ${resp.message}`}
          />
        )
      } else {
        dispatch({
          type: EditMentionActionType.ADD_ITEM,
          payload: item
        })
        // show success
        showSuccessMessage(
          <SanitizedMathMLBox
            component="span"
            rawHtml={`Added ${item.title}`}
          />
        )
        // increase count
        setReferencePapersCnt(reference_papers+1)
      }
    } else {
      // probably new item from crossref or datacite
      const resp = await addNewReferencePaperToSoftware({item, software, token})
      // debugger
      if (resp.status === 200) {
        dispatch({
          type: EditMentionActionType.ADD_ITEM,
          // updated item is in message
          payload: resp.message
        })
        // show success
        showSuccessMessage(
          <SanitizedMathMLBox
            component="span"
            rawHtml={`Added ${item.title}`}
          />
        )
        // increase count
        setReferencePapersCnt(reference_papers+1)
      } else {
        showErrorMessage(resp.message as string)
      }
    }
  }

  async function processOnDelete(action: EditMentionAction) {
    const item = action.payload
    if (item.id) {
      const resp = await removeReferencePaperForSoftware({
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
        // decrease count
        if (reference_papers>0) setReferencePapersCnt(reference_papers-1)
        // try to remove mention item
        // we do not handle response result
        // because if mention is referenced in other
        // software the delete action will fail (and that's ok)
        await deleteMentionItem({
          id: item.id,
          token
        })
      } else {
        showErrorMessage(
          <SanitizedMathMLBox
            component="span"
            rawHtml={`Failed to delete ${item.title}. ${resp.message}`}
          />
        )
      }
    } else {
      showErrorMessage(
        <SanitizedMathMLBox
          component="span"
          rawHtml={`Failed to delete ${item.title}. Invalid item id ${item.id}`}
        />
      )
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
        // ONLY FOR rsd-admin to update item
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
        logger('ON_UPDATE action not supported','warn')
        // pass original action
        dispatch(action)
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
