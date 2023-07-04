// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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

export async function listenForOrcidCalls(page) {
  // monitor api calls
  // console.log('input...', input)
  await page.route('https://pub.orcid.org/v3.0/expanded-search/?q=given-names:John+AND+family-name:*', async route => {
    // const url = route.request().url()
    // console.log('pub.orcid.org...url...', url)
    const filename = 'mocks/data/orcid_john_doe.json'
    // mock route response with local data file
    await route.fulfill({path: filename})
  })

  await page.route('https://pub.orcid.org/v3.0/expanded-search/?q=given-names:Dusan+AND+family-name:*', async route => {
    // const url = route.request().url()
    // console.log('pub.orcid.org...url...', url)
    const filename = 'mocks/data/orcid_dusan_mijatovic.json'
    // mock route response with local data file
    await route.fulfill({path: filename})
  })

  await page.route('https://pub.orcid.org/v3.0/expanded-search/?q=orcid:0000-0002-1898-4461*', async route => {
    // const url = route.request().url()
    // console.log('pub.orcid.org...url...', url)
    const filename = 'mocks/data/orcid_dusan_mijatovic.json'
    // mock route response with local data file
    await route.fulfill({path: filename})
  })
}
