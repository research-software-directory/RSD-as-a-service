// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createMarkdown, generateId} from '../helpers/utils'
import {fundingOrganisation} from './mockOrganisation'

export type MockedProject = typeof mockProject.chromium

export const titleId = generateId()

export const mockProject = {
  chrome: {
    title: `Test project chrome ${titleId}`,
    desc: 'Lorem ipsum description',
    slug: `test-project-chrome-${titleId}`,
    image: {
      file: 'images/pexels-739407-1600.jpg',
      caption: 'Eiffel tower in Paris by Eugene Dorosh (www.pexels)'
    },
    startDate: '2020-12-01',
    endDate: '2022-01-01',
    grantId: '12345ABC',
    // ensure unique organisation names
    // otherwise the duplicate error might ocure
    // because same tests might run in parallel
    // on multiple browsers
    fundingOrganisations: fundingOrganisation['chrome'],
    links: [
      {label: 'Test link 1', url: 'https://google.com/link1'},
      {label: 'Test link 2', url: 'https://google.com/link2'},
      {label: 'Test link 3', url: 'https://google.com/link3'}
    ],
    keywords: ['Big data', 'GPU', 'Testing'],
    markdown: createMarkdown('chrome')
  },
  chromium: {
    title: `Test project chromium ${titleId}`,
    desc: 'Lorem ipsum description',
    slug: `test-project-chromium-${titleId}`,
    image: {
      file: 'images/pexels-739407-1600.jpg',
      caption: 'Eiffel tower in Paris by Eugene Dorosh (www.pexels)'
    },
    startDate: '2020-12-01',
    endDate: '2022-01-01',
    grantId: '12345ABC',
    // ensure unique organisation names
    // otherwise the duplicate error might ocure
    // because same tests might run in parallel
    // on multiple browsers
    fundingOrganisations: fundingOrganisation['chromium'],
    links: [
      {label: 'Test link 1', url: 'https://google.com/link1'},
      {label: 'Test link 2', url: 'https://google.com/link2'},
      {label: 'Test link 3', url: 'https://google.com/link3'}
    ],
    keywords:['Big data','GPU','Testing'],
    markdown: createMarkdown('chromium')
  },
  firefox: {
    title: `Test project firefox ${titleId}`,
    desc: 'Lorem ipsum description',
    slug: `test-project-firefox-${titleId}`,
    image: {
      file: 'images/pexels-814499-1920.jpg',
      caption: 'Grey bridge and trees by Martin Damboldt (www.pexels)'
    },
    startDate: '2020-12-01',
    endDate: '2022-01-01',
    grantId: '12345ABC',
    // ensure unique organisation names
    // otherwise the duplicate error might ocure
    // because same tests might run in parallel
    // on multiple browsers
    fundingOrganisations: fundingOrganisation['firefox'],
    links: [
      {label: 'Test link 1', url: 'https://google.com/link1'},
      {label: 'Test link 2', url: 'https://google.com/link2'},
      {label: 'Test link 3', url: 'https://google.com/link3'}
    ],
    keywords: ['Big data', 'GPU', 'Testing'],
    markdown: createMarkdown('firefox')
  },
  msedge: {
    title: `Test project msedge ${titleId}`,
    desc: 'Lorem ipsum description',
    slug: `test-project-msedge-${titleId}`,
    image: {
      file: 'images/pexels-6054896-1920.jpg',
      caption: 'A leopard lying down on the ground (www.pexels)'
    },
    startDate: '2020-12-01',
    endDate: '2022-01-01',
    grantId: '12345ABC',
    // ensure unique organisation names
    // otherwise the duplicate error might ocure
    // because same tests might run in parallel
    // on multiple browsers
    fundingOrganisations: fundingOrganisation['msedge'],
    links: [
      {label: 'Test link 1', url: 'https://google.com/link1'},
      {label: 'Test link 2', url: 'https://google.com/link2'},
      {label: 'Test link 3', url: 'https://google.com/link3'}
    ],
    keywords: ['Big data', 'GPU', 'Testing'],
    markdown: createMarkdown('msedge')
  },
  webkit: {
    title: `Test project webkit ${titleId}`,
    desc: 'Lorem ipsum description',
    slug: `test-project-webkit-${titleId}`,
    image: {
      file: 'images/pexels-3041110-1280.jpg',
      caption: 'Red rose flower by Og Mpango (www.pexels)'
    },
    startDate: '2020-12-01',
    endDate: '2022-01-01',
    grantId: '12345ABC',
    // ensure unique organisation names
    // otherwise the duplicate error might ocure
    // because same tests might run in parallel
    // on multiple browsers
    fundingOrganisations: fundingOrganisation['webkit'],
    links: [
      {label: 'Test link 1', url: 'https://google.com/link1'},
      {label: 'Test link 2', url: 'https://google.com/link2'},
      {label: 'Test link 3', url: 'https://google.com/link3'}
    ],
    keywords: ['Big data', 'GPU', 'Testing'],
    markdown: createMarkdown('webkit')
  }
}
