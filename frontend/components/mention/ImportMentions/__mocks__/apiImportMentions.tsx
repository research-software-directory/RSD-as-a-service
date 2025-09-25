// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {MentionItemProps} from '~/types/Mention'

// MOCKED responses
import mockMentionResponse from './addMentions.json'
import {DoiBulkImportReport} from '../apiImportMentions'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function validateInputList(doiList: string[], mentions: MentionItemProps[], token: string) {
  // here we put validation results for each doi from doiList
  const mentionResultPerDoi: DoiBulkImportReport = new Map()

  doiList.forEach((doi,pos)=>{

    mentionResultPerDoi.set(doi,{doi, status: 'valid', include: true, source: 'RSD', mention: mentions[pos]})
  })

  return mentionResultPerDoi
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function linkMentionToEntity({ids, table, entityName, entityId, token}: {
  ids: string[], table: string, entityName: string, entityId: string, token: string
}) {
  // console.log('linkMentionToEntity...default MOCK...ids...', ids)
  return {
    status: 200,
    message: 'OK'
  }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function addMentions({mentions, token}: { mentions: MentionItemProps[], token: string }) {
  // console.log('addMentions...default MOCK...mentions...', mentions)
  return {
    status: 200,
    message: mockMentionResponse
  }
}
