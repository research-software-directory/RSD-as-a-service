// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {generateId} from '../helpers/utils'

export type Person = {
  name: string
  email: string
  role: string
  affiliation: string
  avatar: string
  apiUrl: string
  orcid: string | null
}

export function getRandomPerson(browserName:string) {
  return {
    name: `John Doe ${generateId()}`,
    email: `test${generateId()}@example.com`,
    role: `Senior Developer ${generateId()}`,
    affiliation: `Created by ${browserName} ${generateId()}`,
    avatar: 'images/dmijat_2007.jpg',
    apiUrl: '/pub.orcid.org/',
    orcid: null
  }
}

export function getDusanMijatovic(browserName: string) {
  return {
    name: 'Dusan Mijatovic',
    email: `test${generateId()}@example.com`,
    role: `Senior Frontend Developer ${generateId()}`,
    affiliation: `Created by ${browserName} ${generateId()}`,
    avatar: 'images/dmijat_2007.jpg',
    apiUrl: '/pub.orcid.org/',
    orcid: '0000-0002-1898-4461'
  }
}
