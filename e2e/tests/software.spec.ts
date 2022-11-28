// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {test, expect} from '@playwright/test'
import {
  createSoftware, editSoftwareInput,
  conceptDoiFeatures,
  openEditSoftwarePage,
  openEditContributors,
  importContributors,
  editFirstContact,
  createContact
} from '../helpers/software'
import {mockSoftware} from '../mocks/mockSoftware'
import {randomPerson} from '../mocks/mockPerson'
import {openEditPage} from '../helpers/utils'

// run in serial mode
test.describe.configure({mode: 'serial'})

test('Create software', async ({page, browserName}) => {
  // get mock software for the browser
  const software = mockSoftware[browserName]
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

test('Edit software info', async ({page, browserName}) => {
  // get mock software for the browser
  const software = mockSoftware[browserName]
  // open edit software page
  const url = `/software/${software.slug}`
  await openEditPage(page, url, software.title)

  // edit software values
  await editSoftwareInput(page, software)

  // test DOI imports
  await conceptDoiFeatures(page, software.doi, software.doiApi)

  // publish the software
  await page.getByLabel('Published').check()

  // find view page button
  const viewPage = page.getByRole('button', {
    name: 'view page'
  })
  // open view page
  await viewPage.click()
})

test('Edit contributors', async ({page, browserName}) => {
  // get mock software for the browser
  const software = mockSoftware[browserName]
  const contact = randomPerson[browserName]

  // open edit software page
  await openEditSoftwarePage(page, `Test software ${browserName}`)

  // navigate to contributors section
  await openEditContributors(page)

  // import contributors
  if (software.doi) {
    await importContributors(page)
  }

  // edit first contributor
  await editFirstContact(page)

  // add new contact
  await createContact(page,contact)
})

