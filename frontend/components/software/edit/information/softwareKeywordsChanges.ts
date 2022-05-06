import {UseFieldArrayUpdate, UseFormGetFieldState} from 'react-hook-form'

import {EditSoftwareItem, KeywordForSoftware} from '~/types/SoftwareTypes'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'

type KeywordChanges = {
  updateKeyword: UseFieldArrayUpdate<EditSoftwareItem, 'keywords'>
  formData: EditSoftwareItem
  getFieldState: UseFormGetFieldState<EditSoftwareItem>
  projectState?: EditSoftwareItem
}

export type SoftwareKeyword = {
  // UUID
  software: string,
  // UUID
  keyword: string
}

export type SoftwareKeywordsForSave = {
  create: KeywordForSoftware[],
  add: KeywordForSoftware[],
  delete: SoftwareKeyword[],
  updateKeyword: UseFieldArrayUpdate<EditSoftwareItem, 'keywords'>
}

export function getKeywordChanges(props: KeywordChanges) {
  const {updateKeyword,formData,getFieldState,projectState} = props
  const keywords: SoftwareKeywordsForSave = {
    create: [],
    add: [],
    delete: [],
    updateKeyword
  }
  formData.keywords.forEach((item, pos) => {
    const name = getFieldState(`keywords.${pos}.keyword`)
    // using only "dirty" items, because dirty items
    // are the items that are new/changed since last save (form reset)
    if (name.isDirty === true) {
      if (item?.action === 'create') {
        // update position
        item.pos = pos
        // add item
        keywords.create.push(item)
      } else if (item.id) {
        // only items with id
        keywords.add.push(item)
      }
    }
  })
  // find deleted items
  if (projectState?.keywords && projectState?.keywords.length > 0) {
    const toDelete = itemsNotInReferenceList({
      list: projectState?.keywords,
      referenceList: formData.keywords,
      key: 'keyword'
    })
    // debugger
    toDelete.forEach(item => {
      if (item.id) {
        keywords.delete.push({
          software: item.software,
          keyword: item.id
        })
      }
    })
  }

  return keywords
}
