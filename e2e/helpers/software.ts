// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {expect, Page} from '@playwright/test'
import {listenForOrcidCalls, Person} from '../mocks/mockPerson'
import {CreateSoftwareProps, MockedSoftware} from '../mocks/mockSoftware'
import {Testimonial} from '../mocks/mockTestimonials'
import {acceptUserAgreement} from './userAgreement'
import {fillAutosaveInput, generateId, uploadFile} from './utils'

export async function createSoftware({title, desc, slug, page}: CreateSoftwareProps) {
  // accept user agreement first
  // await acceptUserAgreementInSettings(page)

  // get add menu item
  const addMenu = page.getByTestId('add-menu-button')
  const newSoftware = page.getByRole('menuitem', {
    name: 'New Software'
  })
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })
  // click on add button
  await addMenu.click()
  // open add software page
  await Promise.all([
    page.waitForURL('**/add/software',{
      waitUntil: 'networkidle'
    }),
    newSoftware.click()
  ])

  // accept user agreement if modal present
  await acceptUserAgreement(page)

  // add name
  await Promise.all([
    // fill in software name
    page.getByLabel('Name').fill(title),
    // wait for response on slug validation
    page.waitForResponse(RegExp(slug))
  ])
  // add description
  await page.getByLabel('Short description').fill(desc)
  // get slug
  const inputSlug = await page.getByLabel('The url of this software will be').inputValue()
  const url = RegExp(`${inputSlug}/edit/information`)
  // click save button
  await Promise.all([
    page.waitForURL(url,{
      waitUntil: 'networkidle'
    }),
    saveBtn.click()
  ])
  // return slug
  return inputSlug
}

export async function editSoftwareDescription(page: Page, mockSoftware: MockedSoftware) {
  // add custom markdown
  await page.getByText('Custom markdown').click()
  // write markdown
  const markdown = page.locator('#markdown-textarea')
  await fillAutosaveInput({
    page,
    element: markdown,
    value: mockSoftware.markdown
  })
}

export async function editSoftwareMetadata(page: Page, mockSoftware: MockedSoftware) {
  // add get started url
  const getStarted = await page.getByLabel('Get Started URL')
  await fillAutosaveInput({
    page,
    element: getStarted,
    value: mockSoftware.repoUrl
  })
  // add repository url
  const repoUrl = page.getByLabel('Repository URL')
  await repoUrl.fill(mockSoftware.repoUrl)
  await Promise.all([
    repoUrl.blur(),
    // wait for POST
    page.waitForResponse(/\/repository_url/),
  ])
  // add Concept DOI
  const doi = await page.getByLabel('Software DOI')
  await fillAutosaveInput({
    page,
    element: doi,
    value: mockSoftware.doi
  })
}

export async function conceptDoiFeatures(page: Page, conceptDOI: string, doiApi:string) {
  // reference to buttons
  const validateDOI = page.getByRole('button', {
    name: 'Validate'
  })
  const importKeywords = page.getByRole('button', {
    name: 'Import keywords'
  })
  const importLicenses = page.getByRole('button', {
    name: 'Import licenses'
  })
  // ---------------------------
  // validate DOI
  await Promise.all([
    validateDOI.click(),
    page.waitForResponse(RegExp(doiApi))
  ])
  await page.getByRole('alert').filter({
    hasText: `The DOI ${conceptDOI} is a valid Concept DOI`
  })
  await page.getByRole('button', {
    name: 'Close'
  }).click()

  // --------------------------
  // import keywords
  await Promise.all([
    importKeywords.click(),
    page.waitForResponse(RegExp(doiApi))
  ])
  // does not work as expected!
  await page.getByRole('alert').filter({
    hasText: `keywords imported from ${conceptDOI}`
  })
  await page.getByRole('button', {
    name: 'Close'
  }).click()

  // ---------------------------
  // import licenses
  await Promise.all([
    importLicenses.click(),
    page.waitForResponse(RegExp(doiApi))
  ])
  await page.getByRole('alert').filter({
    hasText: `licenses imported from ${conceptDOI}`
  })
  await page.getByRole('button', {
    name: 'Close'
  }).click()
}

export async function openSoftwarePage(page:Page,name?:string) {
  // open edit software page
  const url = '/software'
  // navigate to software overview
  await page.goto(url, {waitUntil: 'networkidle'})

  // validate we have some software cards in the overview
  const cards = page.getByTestId('software-card-link')
  expect(await cards.count()).toBeGreaterThan(0)

  // select project card
  if (name) {
    // select software
    const softwareCard = await page.getByRole('link', {
      name
    })

    // open software view
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      // take first in case more than one created
      softwareCard.first().click()
    ])
  } else {
    // open first item
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      // take first in case more than one created
      cards.first().click()
    ])
  }
}

export async function openEditSoftwarePage(page, name) {
  // navigate first to software page
  await openSoftwarePage(page,name)
  // open edit software
  const editButton = page.getByTestId('edit-button')
  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    editButton.click()
  ])
}

export async function importContributors(page) {
  // import contributors
  const importContributors = page.getByRole('button', {
    name: 'Import contributors'
  })
  // check button is visible
  expect(importContributors).toBeVisible()
  // perform import
  await Promise.all([
    importContributors.click(),
    page.waitForSelector('[data-testid="contributor-item"]')
  ])
  // close info
  const info = page.getByRole('button', {
    name: 'Close'
  })
  if (await info.isVisible()) {
    // close
    info.click()
  }
}

export async function editFirstContact(page) {
  // validate at least one contributor
  const contributors = page.getByTestId('contributor-item')
  expect(await contributors.count()).toBeGreaterThan(0)
  const randomEmail = `test${generateId()}@examle.com`
  const randomRole = `Developer ${generateId()}`
  // edit first contributor
  const firstEditBtn = contributors.first().getByRole('button', {
    name: 'edit'
  })
  // set breakpoint
  // await page.pause()
  await Promise.all([
    page.waitForSelector('[role="dialog"]'),
    firstEditBtn.click()
  ])
  // enter email
  await page.getByLabel('Email').fill(randomEmail)
  // enter random role
  await page.getByLabel('Role').fill(randomRole)
  // check contact person
  const contactPerson = page.getByLabel('Contact person')
  const isContact = await contactPerson.isChecked()
  if (isContact === false) {
    await page.getByLabel('Contact person').check()
  }
  // save change
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })
  await Promise.all([
    page.waitForResponse(/contributor/),
    page.waitForSelector('[role="dialog"]', {
      state:'hidden'
    }),
    saveBtn.click()
  ])
  // validate contact person flag
  const contact = await contributors.first().textContent()
  expect(contact).toContain('(contact person)')
  // validate role
  expect(contact).toContain(randomRole)
}

export async function createContact(page, contact: Person) {
  // find contributor input
  const findContributor = page.getByRole('combobox', {name: 'Find or add contributor'})

  // fake api calls
  await listenForOrcidCalls(page)

  // search for contact
  await Promise.all([
    page.waitForResponse(RegExp(contact.apiUrl)),
    findContributor.fill(contact.name)
  ])
  // set breakpoint
  // await page.pause()
  // select add new person option
  await Promise.all([
    page.waitForSelector('[role="dialog"]'),
    page.getByRole('option', {
      name: `Add "${contact.name}"`
    }).click()
  ])
  // upload avatar
  await uploadFile(
    page, '#upload-avatar-image',
    contact.avatar,`[alt="${contact.name}"]`
  )
  // add email
  await page.getByLabel('Email').fill(contact.email)
  // add role
  await page.getByLabel('Role').fill(contact.role)
  // add affiliation
  await page.getByLabel('Affiliation').fill(contact.affiliation)
  // save new contact
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })
  await Promise.all([
    page.waitForResponse(/contributor/),
    page.waitForSelector('[role="dialog"]', {
      state: 'hidden'
    }),
    saveBtn.click()
  ])
  // validate last item - the one we just created
  const contributors = page.getByTestId('contributor-item')
  // validate contact person flag
  const contributor = await contributors.last().textContent()
  // validate name
  expect(contributor).toContain(contact.name)
  // validate role
  expect(contributor).toContain(contact.role)
  // validate affiliation
  expect(contributor).toContain(contact.affiliation)
}

export async function addTestimonial(page, item: Testimonial) {
  // await page.getByRole('button', {name: 'Testimonials Optional information'}).click()
  const addBtn = page.getByTestId('add-testimonial-btn')
  // set breakpoint
  // await page.pause()
  // ensure button is visible
  expect(addBtn).toBeVisible()
  // click add button and wait for modal
  await Promise.all([
    page.waitForSelector('#edit-testimonial-modal'),
    addBtn.click()
  ])

  // add values
  await page.getByLabel('Message').fill(item.message)
  await page.getByLabel('Source').fill(item.source)

  // save testimonial
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })
  await Promise.all([
    // save item
    page.waitForResponse(/testimonial/),
    // wait for list to appear
    page.waitForSelector('[data-testid="testimonial-list-item"]'),
    saveBtn.click()
  ])
  // validate list has at least one item
  const testimonials = page.getByTestId('testimonial-list-item')
  const count = await testimonials.count()
  expect(count).toBeGreaterThan(0)

  // validate last item is one we added
  const lastItem = await testimonials
    .last()
    .getByTestId('testimonial-list-item-text')
  expect(await lastItem.textContent()).toContain(item.message)
}
