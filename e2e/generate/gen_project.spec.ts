// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {test, expect} from '@playwright/test'
import {mockProject} from '../mocks/mockProject'
import {createProject} from '../helpers/project'
import {mockCitations} from '../mocks/mockCitations'
import {openEditPage, openEditSection} from '../helpers/utils'
import {saveCitation} from '../helpers/citations'

// run tests in serial mode
// we first need first to create software
test.describe.serial('Project', async () => {
  test('Create project', async ({page}) => {
    // we use chrome project mocks by default
    const proj = mockProject['chrome']
    // start from homepage
    await page.goto('/')
    // create project
    const slug = await createProject({
      page,
      title: proj.title,
      desc: proj.desc,
      slug: proj.slug
    })
    // expect slug
    expect(slug).toEqual(proj.slug)
  })

  test('Add impact', async ({page}) => {
    // https://playwright.dev/docs/test-timeouts#test-timeout
    // this test need to be marked as slow because it saves all data per DOI
    test.slow()
    // get mock software for the browser
    const project = mockProject['chrome']

    // directly open edit software page
    const url = `/projects/${project.slug}`
    await openEditPage(page, url, project.title)

    // navigate to organisations sectiont
    await openEditSection(page, 'Impact')

    // save all impact requests
    const keys = Object.keys(mockCitations)
    for (const key of keys) {
      const citations = mockCitations[key]
      // add citations using doi
      for (const item of citations.dois.impact) {
        await saveCitation(page, item, 'impact_for_project')
      }
    }
  })

  test('Add output', async ({page}) => {
    // https://playwright.dev/docs/test-timeouts#test-timeout
    // this test need to be marked as slow because it saves all data per DOI
    test.slow()
    // get mock software for the browser
    const project = mockProject['chrome']

    // directly open edit software page
    const url = `/projects/${project.slug}`
    await openEditPage(page, url, project.title)

    // navigate to organisations sectiont
    await openEditSection(page, 'Output')

    // save all impact requests
    const keys = Object.keys(mockCitations)
    for (const key of keys) {
      const citations = mockCitations[key]
      // add citations using doi
      for (const item of citations.dois.output) {
        await saveCitation(page, item, 'output_for_project')
      }
    }
  })
})
