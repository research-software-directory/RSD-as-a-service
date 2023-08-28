// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {MentionItemProps} from '~/types/Mention'

// MOCKED responses

import mockMentionResponse from './addMentions.json'

async function mockValidateInput(value: string){
  const doiList = value.split(/\r\n|\n|\r/)
  const results = new Map()

  // Just return all values as VALID
  doiList.forEach((doi,index) => {
    results.set(doi.toLocaleLowerCase(), {
      doi: doi.toLocaleLowerCase(),
      status: 'valid',
      include: true,
      source: 'Crossref',
      mention: {
        id: null,
        doi,
        title: `Test item ${doi}`
      }
    })
  })

  // console.log('mockValidateInput...results...', results)
  return results
}

export function useValidateInputList(token: string) {
  // console.log('useValidateInputList...default MOCK...token...', token)
  return {
    validateInput: mockValidateInput,
    validating: false
  }
}


export async function linkMentionToEntity({ids, table, entityName, entityId, token}: {
  ids: string[], table: string, entityName: string, entityId: string, token: string
}) {
  // console.log('linkMentionToEntity...default MOCK...ids...', ids)
  return {
    status: 200,
    message: 'OK'
  }
}


export async function addMentions({mentions, token}: { mentions: MentionItemProps[], token: string }) {
  // console.log('addMentions...default MOCK...mentions...', mentions)
  return {
    status: 200,
    message: mockMentionResponse
  }
}
