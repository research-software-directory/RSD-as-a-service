// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {test, expect} from '@playwright/test'
import {
  addFundingOrganisation, addKeyword, addResearchDomain,
  createProject, createProjectLink, createTeamMember, editProjectInput, importTeamMemberByOrcid, openEditProjectPage, openEditTeamPage
} from '../helpers/project'
import {mockProject} from '../mocks/mockProject'
import {openEditPage, uploadFile} from '../helpers/utils'
import {randomPerson} from '../mocks/mockPerson'

// run in serial mode
test.describe.configure({mode: 'serial'})

test('Create project', async ({page, browserName}) => {
  // get mock project for the browser
  const project = mockProject[browserName]
  // start from homepage
  await page.goto('/')
  // create project
  const slug = await createProject({
    page,
    title: project.title,
    desc: project.desc,
    slug: project.slug
  })
  // expect slug
  expect(slug).toEqual(project.slug)
})

test('Edit project info', async ({page, browserName}) => {
  // get mock project for the browser
  const project = mockProject[browserName]
  // open project edit page using edit button
  const url = `/projects/${project.slug}`
  await openEditPage(page, url, project.title)

  // upload file
  await uploadFile(page, '#upload-avatar-image', project.image.file)

  // edit project info
  await editProjectInput(page, project)

  // add funding organisations
  for (const org of project.fundingOrganisations) {
    await addFundingOrganisation(page, org)
  }

  // add links
  for (const link of project.links) {
    await createProjectLink(page, link)
  }

  // add research domain
  await addResearchDomain(page)

  // add keywords
  for (const keyword of project.keywords) {
    await addKeyword(page, keyword)
  }

  // publish project
  await page.getByLabel('Published').check()

  // take reference to view page button
  const viewPage = page.getByRole('button', {
    name: 'view page'
  })
  // just click on view page to close
  await viewPage.click()
})

test('Edit team members', async ({page,browserName}) => {
  // get mock software for the browser
  const contact = randomPerson[browserName]
  // open edit software page
  await openEditProjectPage(page, `Test project ${browserName}`)
  // open edit team members page
  await openEditTeamPage(page)
  // create new team member
  await createTeamMember(page,contact)
  // import team member from ORCID
  // uses real name and orcid for validation
  contact.name = 'Dusan Mijatovic'
  contact.orcid = '0000-0002-1898-4461'
  await importTeamMemberByOrcid(page,contact)
})
