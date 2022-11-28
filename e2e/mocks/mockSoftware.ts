// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import { Page } from '@playwright/test'
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
    markdown: createMarkdown('chromium')
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
    markdown: createMarkdown('firefox')
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
    markdown: createMarkdown('webkit')
  }
}
