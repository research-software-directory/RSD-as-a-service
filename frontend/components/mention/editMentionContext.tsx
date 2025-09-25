// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {createContext,JSX} from 'react'
import {MentionItemProps} from '~/types/Mention'
import {EditMentionAction, EditMentionState} from './editMentionReducer'
import NoMentionItems from './NoMentionItems'

export type EditMentionSettings = {
  editModalTitle: string,
  confirmDeleteModalTitle: string,
  noItemsComponent:()=>JSX.Element
}

export type EditModalProps = {
  open:boolean
  pos?: number
  item?: MentionItemProps
}

export type EditMentionDispatch = (action:EditMentionAction)=>void

export type EditOutputContextType = {
  state: EditMentionState,
  dispatch: EditMentionDispatch
}

const initalState:EditMentionState = {
  settings: {
    editModalTitle: 'Edit item',
    confirmDeleteModalTitle: 'Delete item',
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

export const EditMentionContext = createContext<EditOutputContextType>({
  state: initalState,
  dispatch:()=>{}
})


export default EditMentionContext
