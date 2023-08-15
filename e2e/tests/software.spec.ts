// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {test, expect} from '@playwright/test'
import {
  createSoftware, editSoftwareInput,
  conceptDoiFeatures,
  importContributors,
  editFirstContact,
  createContact,
  addTestimonial,
} from '../helpers/software'
import {mockSoftware} from '../mocks/mockSoftware'
import {getRandomPerson} from '../mocks/mockPerson'
import {
  addRelatedProject,
  addRelatedSoftware,
  openEditPage,
  openEditSection,
  uploadFile
} from '../helpers/utils'
import {Organisation, mockSoftwareOrganisation} from '../mocks/mockOrganisation'
import {mockCitations} from '../mocks/mockCitations'
import {addCitation} from '../helpers/citations'
import {mockTestimonial} from '../mocks/mockTestimonials'
import {addOrganisation} from '../helpers/organisations'

// run tests in serial mode
// we first need to create software
// add info and contributors
// contributors can be imported when ConceptDOI is added to
test.describe.serial('Software', async()=> {
  test('Create software', async ({page}, {project}) => {
    // get mock software for the browser
    const software = mockSoftware[project.name]
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

  test('Edit software info', async ({page}, {project}) => {
    // mark this test as slow, see https://playwright.dev/docs/test-timeouts#test-timeout
    test.slow()
    // get mock software for the browser
    const software = mockSoftware[project.name]
    // open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // edit software values
    await editSoftwareInput(page, software)

    // upload file
    await uploadFile(page, '#upload-software-logo', software.logo)

    // test DOI imports
    await conceptDoiFeatures(page, software.doi, software.doiApi)

    // publish the software
    await page.getByLabel('Published').check()

    // open view page
    await page.getByTestId('view-page-button').click()
  })

  test('Edit contributors', async ({page}, {project}) => {
    // get mock software for the browser
    const software = mockSoftware[project.name]
    const contact = getRandomPerson(project.name)

    // directly open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // navigate to contributors section
    await openEditSection(page, 'Contributors')

    // import contributors
    if (software.doi) {
      await importContributors(page)
    }

    // edit first contributor
    await editFirstContact(page)

    // add new contact
    await createContact(page, contact)
  })

  test('Add organisations', async ({page}, {project}) => {
    // get mock software for the browser
    const software = mockSoftware[project.name]
    const organisations: Organisation[] = mockSoftwareOrganisation[project.name]

    // directly open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // navigate to organisations section
    await openEditSection(page, 'Organisations')

    // create organisations
    for (const org of organisations) {
      await addOrganisation(page, org, 'software_for_organisation')
    }

    const items = page.getByTestId('organisation-list-item')
    const [count] = await Promise.all([
      items.count(),
      page.waitForLoadState('networkidle')
    ])
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('Add mentions using DOI', async ({page}, {project}) => {
    // get mock software for the browser
    const software = mockSoftware[project.name]
    const citations = mockCitations[project.name]

    // directly open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // navigate to organisations sectiont
    await openEditSection(page, 'Mentions')

    // add mentions using doi
    for (const item of citations.dois.mention) {
      await addCitation(page, item, 'mention_for_software')
    }
  })

  test('Add testimonials', async ({page}, {project}) => {
    // get mock software for the browser
    const software = mockSoftware[project.name]
    const testimonials = mockTestimonial[project.name]
    // directly open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // navigate to organisations section
    await openEditSection(page, 'Testimonials')

    // create testimonals
    for (const item of testimonials) {
      await addTestimonial(page, item)
    }

  })

  // We test related items as last because we
  // need some items to be created and published
  test('Related items', async ({page}, {project}) => {
    const software = mockSoftware[project.name]

    // directly open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // navigate to related topics section
    await openEditSection(page, 'Related topics')
    // add some related software randomly
    await addRelatedSoftware(page, 'software_for_software')
    // add some related projects randomly
    await addRelatedProject(page, 'software_for_project')
  })

})

