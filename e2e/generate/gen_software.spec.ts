// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {test, expect} from '@playwright/test'
import {mockSoftware} from '../mocks/mockSoftware'
import {createSoftware} from '../helpers/software'
import {mockCitations} from '../mocks/mockCitations'
import {openEditPage, openEditSection} from '../helpers/utils'
import {saveCitation} from '../helpers/citations'
import {mockSoftwareOrganisation} from '../mocks/mockOrganisation'
import {saveOrganisation} from '../helpers/organisations'

// run tests in serial mode
// we first need first to create software
test.describe.serial('Software', async () => {

  test('Create software', async ({page}) => {
    // get mock software for the browser
    const software = mockSoftware['chrome']
    // start from homepage
    await page.goto('/')
    // create software
    const slug = await createSoftware({
      page,
      title: software.title,
      desc: software.desc,
      slug: software.slug
    })
    // expect slug
    expect(slug).toEqual(software.slug)
  })

  test('Generate mentions using DOI', async ({page}) => {
    // https://playwright.dev/docs/test-timeouts#test-timeout
    // this test need to be marked as slow because it saves all data per DOI
    test.slow()
    // get mock software for the browser
    const software = mockSoftware['chrome']

    // directly open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // navigate to organisations sectiont
    await openEditSection(page, 'Mentions')

    const keys = Object.keys(mockCitations)
    for (const key of keys) {
      const citations = mockCitations[key]
      // add mentions using doi
      for (const item of citations.dois.mention) {
        await saveCitation(page, item, 'mention_for_software')
      }
    }
  })

  test('Generate organisations', async ({page}) => {
    // get mock software for the browser
    const proj = mockSoftware['chrome']
    const organisations = mockSoftwareOrganisation['chrome'].map(item => item.name)

    // directly open edit page
    const url = `/software/${proj.slug}`
    await openEditPage(page, url, proj.title)

    // navigate to organisations section
    await openEditSection(page, 'Organisations')

    // create organisations
    for (const org of organisations) {
      const saved = await saveOrganisation(page, org)
      expect(saved).toBeTruthy()
    }
  })
})

