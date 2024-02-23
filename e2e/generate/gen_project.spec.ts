// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {test, expect} from '@playwright/test'
import {mockProject} from '../mocks/mockProject'
import {createProject} from '../helpers/project'
import {mockCitations} from '../mocks/mockCitations'
import {openEditPage, openEditSection, selectTab} from '../helpers/utils'
import {saveCitation} from '../helpers/citations'
import {fundingOrganisation, mockProjectOrganisation} from '../mocks/mockOrganisation'
import {saveOrganisation} from '../helpers/organisations'

// run tests in serial mode
// we need first to create project
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

  test('Generate organisations', async ({page}) => {
    // get mock software for the browser
    const proj = mockProject['chrome']
    const organisations = [
      ...mockProjectOrganisation['chrome'].map(item=>item.name),
      ...fundingOrganisation['chrome'],
      ...mockProjectOrganisation['chromium'].map(item=>item.name),
      ...fundingOrganisation['chromium']
    ]

    // directly open edit page
    const url = `/projects/${proj.slug}`
    await openEditPage(page, url, proj.title)

    // navigate to organisations section
    await openEditSection(page, 'Organisations')

    // create organisations
    for (const org of organisations) {
      const saved = await saveOrganisation(page, org)
      expect(saved).toBeTruthy()
    }
  })

  test('Generate impact', async ({page}) => {
    // https://playwright.dev/docs/test-timeouts#test-timeout
    // this test need to be marked as slow because it saves all data per DOI
    test.slow()
    // get mock software for the browser
    const project = mockProject['chrome']

    // directly open edit software page
    const url = `/projects/${project.slug}`
    await openEditPage(page, url, project.title)

    // navigate to organisations sectiont
    await openEditSection(page, 'Mentions')
    // select impact tab
    await selectTab(page,'Impact')

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

  test('Generate output', async ({page}) => {
    // https://playwright.dev/docs/test-timeouts#test-timeout
    // this test need to be marked as slow because it saves all data per DOI
    test.slow()
    // get mock software for the browser
    const project = mockProject['chrome']

    // directly open edit software page
    const url = `/projects/${project.slug}`
    await openEditPage(page, url, project.title)

    // navigate to organisations sectiont
    await openEditSection(page, 'Mentions')
    // select impact tab
    await selectTab(page,'Output')

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
