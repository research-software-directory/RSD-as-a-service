// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Page} from '@playwright/test'
import {createMarkdown} from '../helpers/utils'
import {generateId} from '../helpers/utils'

export type CreateSoftwareProps = {
  title: string,
  desc: string,
  slug: string,
  page: Page
}

export type MockedSoftware = typeof mockSoftware.chromium

export const titleId = generateId()

export const mockSoftware = {
  chrome: {
    title: `Test software chrome ${titleId}`,
    // title: 'Test software chrome 18401',
    desc: 'Lorem ipsum description',
    slug: `test-software-chrome-${titleId}`,
    // slug: 'test-software-chrome-18401',
    repoUrl: 'https://research-software-directory.github.io/RSD-as-a-service/',
    // use the label of platform option
    platform: 'GitHub',
    doi: '10.5281/zenodo.6379973',
    // api used for imports
    doiApi: 'api.datacite.org',
    markdown: createMarkdown('chrome'),
    logo: 'images/dv4all-logo.svg'
  },
  chromium: {
    title: `Test software chromium ${titleId}`,
    desc: 'Lorem ipsum description',
    slug: `test-software-chromium-${titleId}`,
    repoUrl: 'https://research-software-directory.github.io/RSD-as-a-service/',
    // use the label of platform option
    platform: 'GitHub',
    doi: '10.5281/zenodo.6379973',
    // api used for imports
    doiApi: 'api.datacite.org',
    markdown: createMarkdown('chromium'),
    logo: 'images/abacaxi-fruit-pineapple-svgrepo-com.svg'
  },
  firefox: {
    title: `Test software firefox ${titleId}`,
    desc: 'Lorem ipsum description',
    slug: `test-software-firefox-${titleId}`,
    repoUrl: 'https://research-software-directory.github.io/RSD-as-a-service/',
    // use the label of platform option
    platform: 'GitHub',
    doi: '10.5281/zenodo.1217111',
    // api used for imports
    doiApi: 'api.datacite.org',
    markdown: createMarkdown('firefox'),
    logo: 'images/amoras-fruit-svgrepo-com.svg'
  },
  msedge: {
    title: `Test software msedge ${titleId}`,
    desc: 'Lorem ipsum description',
    slug: `test-software-msedge-${titleId}`,
    repoUrl: 'https://research-software-directory.github.io/RSD-as-a-service/',
    // use the label of platform option
    platform: 'GitHub',
    doi: '10.5281/zenodo.6379973',
    // api used for imports
    doiApi: 'api.datacite.org',
    markdown: createMarkdown('msedge'),
    logo: 'images/bee-svgrepo-com.svg'
  },
  webkit: {
    title: `Test software webkit ${titleId}`,
    desc: 'Lorem ipsum description',
    slug: `test-software-webkit-${titleId}`,
    repoUrl: 'https://research-software-directory.github.io/RSD-as-a-service/',
    // use the label of platform option
    platform: 'GitHub',
    doi: '10.5281/zenodo.1220113',
    // api used for imports
    doiApi: 'api.datacite.org',
    markdown: createMarkdown('webkit'),
    logo: 'images/hibiscus-svgrepo-com.svg'
  }
}
