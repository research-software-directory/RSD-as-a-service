// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ApiParams} from '~/utils/postgrestUrl'
import {RsdContributor} from '../useContributors'

import mockContributors from './person_mentions.json'

export async function getContributors({page, rows, token, searchFor, orderBy}: ApiParams<RsdContributor, keyof RsdContributor>) {
  // console.log('getContributors...default MOCK')
  return {
    count: mockContributors.length,
    contributors: mockContributors
  }
}

export async function patchPerson({id, key, value, origin, token}: {
  id: string, key: string, value: any, origin?: string, token: string
}) {
  // console.log('patchPerson...default MOCK')
  return {
    status: 200,
    message: 'OK'
  }
}
