// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useReducer} from 'react'

import {useSession} from '~/auth'
import logger from '~/utils/logger'
import {MentionItemProps} from '~/types/Mention'
import {deleteMentionItem, updateMentionItem} from '~/utils/editMentions'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {
  EditMentionAction, EditMentionActionType,
  editMentionReducer, EditMentionState
} from '~/components/mention/editMentionReducer'
import EditMentionContext from '~/components/mention/editMentionContext'
import {getMentionType} from '~/components/mention/config'
import SanitizedMathMLBox from '~/components/layout/SanitizedMathMLBox'
import useProjectContext from '../../useProjectContext'
import {useProjectMentionContext} from '../ProjectMentionContext'
import {addToImpactForProject, addNewImpactToProject, removeImpactForProject} from './impactForProjectApi'
import NoImpactItems from './NoImpactItems'

const initialState:EditMentionState = {
  settings: {
    editModalTitle: 'Impact',
    confirmDeleteModalTitle: 'Delete impact item',
    noItemsComponent:()=><NoImpactItems/>
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
  return (
    <SanitizedMathMLBox
      component="span"
      rawHtml={message}
    />
  )
}

function createErrorMessage(message:string) {
  return (
    <SanitizedMathMLBox
      component="span"
      rawHtml={message}
    />
  )
}

export default function EditImpactProvider(props:any) {
  const {user,token} = useSession()
  const {project:{id:project}} = useProjectContext()
  const {showErrorMessage,showSuccessMessage,showInfoMessage} = useSnackbar()
  const {loading,impact:mentions,counts:{impact},setImpactCnt} = useProjectMentionContext()
  // initialize state with loading and items received from the parent.
  const [state, dispatch] = useReducer(
    editMentionReducer,
    {
      ...initialState,
      // use inital values from useProjectMentionContext hook
      loading,
      mentions
    }
  )

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

  // console.group('EditImpactProvider')
  // console.log('project...', project)
  // console.groupEnd()

  async function processOnSubmit(action: EditMentionAction) {

    const item = action.payload
    // new item created manually
    if (item.id === null || item.id === '') {
      item.id = null
      item.source = 'RSD'
      // new item to be added
      const resp = await addNewImpactToProject({
        item,
        project,
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
        // increase count
        setImpactCnt(impact+1)
      } else {
        showErrorMessage(resp.message as string)
      }
    } else if (user?.role === 'rsd_admin') {
      // rsd_admin can update mention
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
        showErrorMessage(
          createErrorMessage(`Failed to save ${item.title}. ${resp.message}`)
        )
      }
    }
  }

  async function processOnAdd(action: EditMentionAction) {
    const item = action.payload
    // check if already in collection
    if (item.doi) {
      const found = state.mentions.find(mention=>mention.doi===item.doi)
      if (found) {
        showInfoMessage(`Impact item with DOI ${item.doi} is already in ${getMentionType(item.mention_type,'plural')}.`)
        return true
      }
    }
    if (item.id) {
      // existing RSD mention item to be added to project
      const resp = await addToImpactForProject({
        project,
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
        // increase count
        setImpactCnt(impact+1)
      }
    } else {
      // probably new item from crossref or datacite
      const resp = await addNewImpactToProject({
        item,
        project,
        token
      })
      if (resp.status === 200) {
        dispatch({
          type: EditMentionActionType.ADD_ITEM,
          // updated item is in message
          payload: resp.message
        })
        // show success
        showSuccessMessage(createSuccessMessage(resp.message as MentionItemProps))
        // increase count
        setImpactCnt(impact+1)
      } else {
        showErrorMessage(resp.message as string)
      }
    }
  }

  async function processOnDelete(action: EditMentionAction) {
    const item = action.payload
    if (item.id) {
      const resp = await removeImpactForProject({
        project,
        mention: item.id,
        token
      })
      if (resp.status == 200) {
        dispatch({
          type: EditMentionActionType.DELETE_ITEM,
          // item is returned in message
          payload: item
        })
        // increase count
        if (impact>0) setImpactCnt(impact-1)
        // try to remove mention item from RSD
        // we do not handle response status
        // if mention is referenced elswhere
        // delete action will fail (and that's ok)
        const del = await deleteMentionItem({
          id: item.id,
          token
        })
      } else {
        showErrorMessage(
          createErrorMessage(`Failed to delete ${item.title}. ${resp.message}`)
        )
      }
    } else {
      showErrorMessage(
        createErrorMessage(`Failed to delete ${item.title}. Invalid item id ${item.id}`)
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
        // do not allow update of mentions (only rsd_admin)
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
