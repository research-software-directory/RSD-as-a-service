// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {expect, Page} from '@playwright/test'
import {Person} from '../mocks/mockPerson'
import {MockedProject} from '../mocks/mockProject'
import {CreateSoftwareProps} from '../mocks/mockSoftware'
import {acceptUserAgreement} from './userAgreement'
import {fillAutosaveInput, generateId, uploadFile} from './utils'

export async function createProject({title, desc, slug, page}: CreateSoftwareProps) {
  // get add menu item
  const addMenu = page.getByTestId('add-menu-button')
  const newProject = page.getByRole('menuitem', {
    name: 'New Project'
  })
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })

  // click on add button
  await addMenu.click()
  // click new project
  await Promise.all([
    page.waitForURL('**/projects/add', {
      waitUntil: 'networkidle'
    }),
    newProject.click()
  ])

  // accept user agreement if modal present
  await acceptUserAgreement(page)

  // fill in the form
  await Promise.all([
    // fill in title
    page.locator('#Title').fill(title),
    // wait for response on slug validation
    page.waitForResponse( RegExp(slug))
  ])

  // add subtitle
  await page.getByLabel('Subtitle').fill(desc)

  // get slug
  const inputSlug = await page.getByLabel('The url of this project will be').inputValue()
  const url = RegExp(`${inputSlug}/edit`)

  // click save button
  await Promise.all([
    page.waitForNavigation({
      url,
      waitUntil: 'networkidle'
    }),
    saveBtn.click()
  ])
  // return slug
  return inputSlug
}

export async function editProjectInput(page: Page, mockProject: MockedProject) {
  // image caption if provided
  if (mockProject?.image?.caption) {
    const caption = page.getByPlaceholder('Image caption')
    await fillAutosaveInput({
      page,
      element: caption,
      value: mockProject.image?.caption
    })
  }
  // markdown
  const markdown = page.locator('#markdown-textarea')
  await fillAutosaveInput({
    page,
    element: markdown,
    value: mockProject.markdown
  })
  // start date
  const startDate = page.getByLabel('Start date')
  await fillAutosaveInput({
    page,
    element: startDate,
    value: mockProject.startDate
  })
  // end date
  const endDate = page.getByLabel('End date')
  await fillAutosaveInput({
    page,
    element: endDate,
    value: mockProject.endDate
  })
  // grant id
  const grantId = page.getByLabel('Grant ID')
  await fillAutosaveInput({
    page,
    element: grantId,
    value: mockProject.grantId
  })
}

export async function addFundingOrganisation(page: Page, organisation: string) {
  const fundingInput = page.getByRole('combobox', {name: 'Find funding organisation'})

  // await page.pause()
  await Promise.all([
    page.waitForResponse(/api.ror.org\/organizations/),
    page.waitForLoadState('networkidle'),
    fundingInput.fill(organisation)
  ])

  // await page.pause()
  // get list
  const listbox = page.locator('#async-autocomplete-listbox')
  // select all options
  const options = listbox.getByRole('option')
  const option = await options
    .filter({
      hasText: RegExp(organisation,'i')
    })
    .first()

  await Promise.all([
    // select first option
    option.click(),
    // wait for api update
    page.waitForRequest(/\/project_for_organisation/)
  ])
}

export async function createProjectLink(page: Page, {label, url}: { label: string, url: string }) {
  // reference btn
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })
  // press add button
  await page.getByRole('button', {
    name: 'Add'
  }).nth(1).click()

  // add link label in the modal
  await page.getByRole('dialog', {
    name: 'Project link'
  }).locator('#title').fill(label)

  // add url
  await page.getByLabel('Url').fill(url)

  // save link
  await Promise.all([
    // click on save
    saveBtn.click(),
    // it should make request to /url_for_project
    page.waitForResponse(/\/url_for_project/)
  ])
}

export async function addResearchDomain(page) {
  const random = generateId(100)
  // select add button
  const addBtn = page.getByTestId('add-research-domains')
  // set brakpoint
  // await page.pause()
  // select first level
  // await page.getByTestId('l1-domain-select').click()
  await page.getByTestId('l1-domain-select')
    .getByRole('button')
    .first()
    .click()
  const l1options = page.getByTestId('l1-domain-item')
  let count = await l1options.count()
  expect(count).toBeGreaterThan(0)
  if (random > 50) {
    await l1options.first().click()
  } else {
    await l1options.last().click()
  }
  // select second level
  await page.getByTestId('l2-domain-select')
    .getByRole('button')
    .first()
    .click()
  const l2options = page.getByTestId('l2-domain-item')
  count = await l2options.count()
  expect(count).toBeGreaterThan(0)
  if (random > 50) {
    await l2options.first().click()
  } else {
    await l2options.last().click()
  }
  // select third level
  await page.getByTestId('l3-domain-select')
    .getByRole('button')
    .first()
    .click()
  const l3options = page.getByTestId('l3-domain-item')
  count = await l3options.count()
  expect(count).toBeGreaterThan(0)
  if (random > 50) {
    await l3options.first().click()
  } else {
    await l3options.last().click()
  }
  // add selected domains
  await Promise.all([
    page.waitForSelector('[data-testid="research-domain-chip"]'),
    addBtn.click(),
  ])
  // validate at least 3 or more research domains
  const chips = page.getByTestId('research-domain-chip')
  expect(await chips.count()).toBeGreaterThanOrEqual(3)
}

export async function addKeyword(page: Page, keyword: string) {
  const keywordInput = page.locator('#async-autocomplete').nth(1)
  // wait for finding
  await Promise.all([
    keywordInput.type(keyword),
    // wait untill options list is shown
    page.waitForSelector('#async-autocomplete-listbox')
  ])
  // select first options
  const option = page.getByRole('option', {
    name: keyword
  })
  await Promise.all([
    option.first().click(),
    page.waitForResponse(/\/keyword_for_project/)
  ])
}

export async function openProjectPage(page: Page, name?: string) {
  // open edit project page
  const url = '/projects'
  // navigate to projects overview
  await page.goto(url, {waitUntil: 'networkidle'})

  // validate we have some projects in the overview
  const cards = page.getByTestId('project-card-link')
  expect(await cards.count()).toBeGreaterThan(0)

  // select project card
  if (name) {
    // we try to find card by name (title)
    const projectCard = page.getByRole('link', {
      name
    })
    // open software view
    await Promise.all([
      page.waitForNavigation(),
      // take first in case more than one created
      projectCard.first().click()
    ])

  } else {
    // open first item
    await Promise.all([
      page.waitForNavigation(),
      // take first in case more than one created
      cards.first().click()
    ])
  }

}

export async function openEditProjectPage(page:Page, name:string) {
  // navigate first to software page
  await openProjectPage(page, name)
  // open edit software
  const editButton = page.getByTestId('edit-button')
  await Promise.all([
    page.waitForNavigation(),
    editButton.click()
  ])
}

export async function openEditTeamPage(page: Page) {
  // open edit team members section
  await page.getByRole('button', {
    name: 'Team Required information'
  }).click()
}

export async function createTeamMember(page, contact: Person) {
  // const findContributor = page.getByLabel('Find or add team member')
  const findContributor = page.getByRole('combobox', {name: 'Find or add team member'})
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
    contact.avatar, `[alt="${contact.name}"]`
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
    page.waitForResponse(/team_member/),
    page.waitForSelector('[role="dialog"]', {
      state: 'hidden'
    }),
    saveBtn.click()
  ])
  // validate last item - the one we just created
  const members = page.getByTestId('team-member-item')
  // validate contact person flag
  const member = await members.last().textContent()
  // validate name
  expect(member).toContain(contact.name)
  // validate role
  expect(member).toContain(contact.role)
  // validate affiliation
  expect(member).toContain(contact.affiliation)
}

export async function importTeamMemberByOrcid(page: Page, contact: Person) {
  // const findContributor = page.getByLabel('Find or add team member')
  const findContributor = page.getByRole('combobox', {name: 'Find or add team member'})

  // search for contact
  await Promise.all([
    page.waitForResponse(RegExp(contact.apiUrl)),
    findContributor.fill(contact.orcid ?? 'Dusan Mijatovic')
  ])
  // set breakpoint
  // await page.pause()
  // select add new person option
  await Promise.all([
    page.waitForSelector('[role="dialog"]'),
    page.getByRole('option').first().click()
  ])
  // save imported contact
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })
  await Promise.all([
    page.waitForResponse(/team_member/),
    page.waitForSelector('[role="dialog"]', {
      state: 'hidden'
    }),
    saveBtn.click()
  ])
  // validate last item - the one we just created
  const members = page.getByTestId('team-member-item')
  // validate contact person primary text
  const member = await members.last()
    .locator('.MuiListItemText-primary')
    .textContent()
  // validate name
  // console.log('member...',member)
  expect(member).toContain(contact.name)
}
