// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createContext} from 'react'
import {MentionItemProps} from '~/types/Mention'
import {EditMentionAction, EditMentionState} from './editMentionReducer'
import NoMentionItems from './NoMentionItems'

// export type EditMentionSettings = {
//   editModalTitle: string,
//   cofirmDeleteModalTitle: string,
//   noItemsComponent:()=>JSX.Element
// }

// export type EditModalProps = {
//   open:boolean
//   pos?: number
//   item?: MentionItemProps
// }

// export type EditMentionContexType = {
//   settings: EditMentionSettings,
//   setSettings: (settings:EditMentionSettings)=>void
//   mentions: MentionItemProps[]
//   // action: EditMentionAction,
//   // setAction: (action: EditMentionAction) => void
//   setMentions: (mentions: MentionItemProps[]) => void,
//   updateMentionItem: (mention:MentionItemProps) => MentionItemProps[],
//   deleteMentionItem: (id: string) => MentionItemProps[],
//   // directly adding found items into RSD
//   onAdd: (item: MentionItemProps) => void
//   // manual add or edit of existing mention
//   onSubmit: (item: MentionItemProps) => void
//   // update button used to update info using DOI
//   onUpdate: (item: MentionItemProps) => void
//   // confirm deleting this item
//   confirmDelete: (item?: MentionItemProps) => void,
//   // delete this item
//   onDelete: (item: MentionItemProps) => void,
//   setEditModal: (props:EditModalProps)=>void,
//   editModal: EditModalProps,
//   // items to act on
//   toAdd?: MentionItemProps,
//   toSave?: MentionItemProps,
//   toUpdate?: MentionItemProps,
//   // item for deleting to be confirmed
//   toConfirm?: MentionItemProps,
//   toDelete?: MentionItemProps,
//   loading: boolean,
//   setLoading:(state:boolean)=>void
// }

// // inital template of context object
// const initalContext = {
//   settings: {
//     editModalTitle: 'Edit item',
//     cofirmDeleteModalTitle: 'Delete item',
//     noItemsComponent:()=><NoMentionItems />
//   },
//   mentions: [],
//   setSettings:()=>{},
//   setMentions:()=>{},
//   updateMentionItem:()=>[],
//   deleteMentionItem:()=>[],
//   onAdd:()=>{},
//   onSubmit:()=>{},
//   onUpdate:()=>{},
//   confirmDelete:()=>{},
//   onDelete:()=>{},
//   setEditModal:()=>{},
//   setLoading:()=>{},
//   editModal: {open: false},
//   loading: true
// }

// const EditMentionContext = createContext<EditMentionContexType>(initalContext)

// export function EditMentionContextProvider(props: any) {
//   // variable config parts
//   const [settings, setSettings] = useState<EditMentionSettings>(initalContext.settings)
//   // mentions list
//   const [mentions, setMentions] = useState<MentionItemProps[]>([])
//   const [editModal, setEditModal] = useState<EditModalProps>({
//     open: false
//   })
//   const [toAdd, setToAdd] = useState<MentionItemProps>()
//   const [toSave, setToSave] = useState<MentionItemProps>()
//   const [toUpdate, setToUpdate] = useState<MentionItemProps>()
//   const [toConfirm, setToConfirm] = useState<MentionItemProps>()
//   const [toDelete, setToDelete] = useState<MentionItemProps>()
//   const [loading, setLoading] = useState(initalContext.loading)

//   console.group('EditMentionContextProvider')
//   console.log('loading...', loading)
//   console.log('mentions...', mentions)
//   console.groupEnd()

//   function onAdd(item: MentionItemProps) {
//     setToAdd(item)
//   }

//   function onSubmit(item: MentionItemProps) {
//     // request save
//     setToSave(item)
//     // close modal
//     setEditModal({
//       open:false
//     })
//   }
//   function onUpdate(item:MentionItemProps) {
//     // request to update this item
//     setToUpdate(item)
//   }
//   function confirmDelete(item:MentionItemProps|undefined) {
//     setToConfirm(item)
//   }
//   function onDelete(item:MentionItemProps) {
//     setToDelete(item)
//   }

//   function deleteMentionItem(id:string) {
//     // console.log('EditMentionContextProvider.deleteMentionItem...', id)
//     // exclude item to delete from impact state
//     const mentionsList = mentions
//       .filter(item => item.id !== id)
//       .sort((a, b) => {
//         // sort mentions on date, newest at the top
//         return sortOnDateProp(a,b,'publication_year','desc')
//       })
//     return mentionsList
//   }

//   function updateMentionItem(mention:MentionItemProps) {
//     // console.log('editMentionContext.updateMentionItem...', mention.id)
//     const mentionsList = mentions
//       .map(item => {
//         if (item.id === mention.id) {
//           return mention
//         }
//         return item
//       })
//       .sort((a, b) => {
//         // sort mentions on date, newest at the top
//         return sortOnDateProp(a,b,'publication_year','desc')
//       })
//     return mentionsList
//   }

//   return (
//     <EditMentionContext.Provider
//       value={{
//         // items state
//         mentions,
//         setMentions,
//         deleteMentionItem,
//         updateMentionItem,
//         // settings,
//         settings,
//         setSettings,
//         // functions called by MentionEditItem
//         onAdd,
//         onSubmit,
//         onUpdate,
//         confirmDelete,
//         onDelete,
//         // items send by functions
//         toAdd,
//         toSave,
//         toUpdate,
//         toConfirm,
//         toDelete,
//         // modal state
//         editModal,
//         setEditModal,
//         // loading indication
//         loading,
//         setLoading
//       }}
//       {...props}
//     />
//   )
// }

export type EditMentionSettings = {
  editModalTitle: string,
  cofirmDeleteModalTitle: string,
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
    cofirmDeleteModalTitle: 'Delete item',
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
