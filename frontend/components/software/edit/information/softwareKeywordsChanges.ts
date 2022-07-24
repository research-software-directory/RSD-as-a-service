// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {UseFieldArrayUpdate} from 'react-hook-form'

import {EditSoftwareItem, KeywordForSoftware} from '~/types/SoftwareTypes'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'

type KeywordChanges = {
  updateKeyword: UseFieldArrayUpdate<EditSoftwareItem, 'keywords'>
  formData: EditSoftwareItem
  previousState?: EditSoftwareItem
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
  const {updateKeyword, formData, previousState} = props
  const keywords: SoftwareKeywordsForSave = {
    create: [],
    add: [],
    delete: [],
    updateKeyword
  }

  function classifyKeywords(newKeywords: KeywordForSoftware[]) {
    newKeywords.forEach((item, pos) => {
      // split to new keywords we need to create
      if (item?.action === 'create') {
        // add item
        keywords.create.push(item)
      } else if (item.id) {
        // only items with id
        keywords.add.push(item)
      }
    })
  }
  // console.group('softwareKeywordChanges.getKeywordChanges')
  const addKeywords = itemsNotInReferenceList({
    list: formData.keywords,
    referenceList: previousState?.keywords ?? [],
    key: 'keyword'
  })
  // console.log('addKeywords...', addKeywords)
  classifyKeywords(addKeywords)

  const removeKeywords = itemsNotInReferenceList({
    list: previousState?.keywords ?? [],
    referenceList: formData.keywords,
    key: 'keyword'
  })
  // console.log('removeKeywords...', removeKeywords)
  removeKeywords.forEach(item => {
    if (item.id) {
      keywords.delete.push({
        software: item.software,
        keyword: item.id
      })
    }
  })
  // console.log('keywords...', keywords)
  // console.groupEnd()
  return keywords
}
