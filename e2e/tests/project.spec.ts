// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {test, expect} from '@playwright/test'
import {
  addKeyword, addResearchDomain,
  createProject, createProjectLink, createTeamMember, editProjectInput,
  importTeamMemberByOrcid, openEditTeamPage
} from '../helpers/project'
import {mockProject} from '../mocks/mockProject'
import {
  addRelatedProject, addRelatedSoftware,
  openEditPage, openEditSection, selectTab, uploadFile
} from '../helpers/utils'
import {getDusanMijatovic, getRandomPerson} from '../mocks/mockPerson'
import {mockCitations} from '../mocks/mockCitations'
import {addCitation} from '../helpers/citations'
import {mockProjectOrganisation} from '../mocks/mockOrganisation'
import {addFundingOrganisation, addOrganisation} from '../helpers/organisations'

// run tests in serial mode
// we first need first to create software
test.describe.serial('Project', async () => {
  test('Create project', async ({page},{project}) => {
    // get mock project for the browser
    const proj = mockProject[project.name]
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

  test('Edit project info', async ({page},{project}) => {
    // mark this test as slow, see https://playwright.dev/docs/test-timeouts#test-timeout
    test.slow()
    // get mock project for the browser
    const proj = mockProject[project.name]
    // open project edit page using edit button
    const url = `/projects/${proj.slug}`
    await openEditPage(page, url, proj.title)

    // upload file
    await uploadFile(page, '#upload-avatar-image', proj.image.file)

    // edit project info
    await editProjectInput(page, proj)

    // add funding organisations
    for (const org of proj.fundingOrganisations) {
      await addFundingOrganisation(page, org)
    }

    // add links
    for (const link of proj.links) {
      await createProjectLink(page, link)
    }
    // set breakpoint
    // await page.pause()
    // add research domain
    await addResearchDomain(page)

    // add keywords
    for (const keyword of proj.keywords) {
      await addKeyword(page, keyword)
    }

    // publish project
    await page.getByLabel('Published').check()

    // open view page
    await page.getByTestId('view-page-button').click()
  })

  test('Edit team members', async ({page}, {project}) => {
    // get mock project for the browser
    const proj = mockProject[project.name]
    // get mock software for the browser
    const contact = getRandomPerson(project.name)
    const dusan = getDusanMijatovic(project.name)

    // open project edit page using edit button
    const url = `/projects/${proj.slug}`
    await openEditPage(page, url, proj.title)

    // open edit team members page
    await openEditTeamPage(page)
    // create new team member
    await createTeamMember(page, contact)
    // import team member from ORCID
    // uses real name and orcid for validation
    await importTeamMemberByOrcid(page, dusan)
  })

  test('Add organisations', async ({page}, {project}) => {
    // get mock software for the browser
    const proj = mockProject[project.name]
    const organisations = mockProjectOrganisation[project.name]

    // directly open edit page
    const url = `/projects/${proj.slug}`
    await openEditPage(page, url, proj.title)

    // navigate to organisations section
    await openEditSection(page, 'Organisations')
    // await page.pause()
    // create organisations
    for (const org of organisations) {
      await addOrganisation(page, org, 'project_for_organisation')
    }
    // check the count
    const count = await page.getByTestId('organisation-list-item').count()
    expect(count).toBeGreaterThanOrEqual(organisations.length)
  })

  test('Add impact', async ({page}, {project: {name}}) => {
    // get mock software for the browser
    const project = mockProject[name]
    const citations = mockCitations[name]

    // directly open edit software page
    const url = `/projects/${project.slug}`
    await openEditPage(page, url, project.title)

    // navigate to organisations sectiont
    await openEditSection(page, 'Mentions')
    // select impact tab
    await selectTab(page,'Impact')
    // await page.getByRole('tab', {name: 'Impact'}).click()

    // add citations using doi
    for (const item of citations.dois.impact) {
      await addCitation(page, item, 'impact_for_project')
    }
  })

  test('Add output', async ({page}, {project: {name}}) => {
    // get mock software for the browser
    const project = mockProject[name]
    const citations = mockCitations[name]

    // directly open edit software page
    const url = `/projects/${project.slug}`
    await openEditPage(page, url, project.title)

    // navigate to organisations sectiont
    await openEditSection(page, 'Mentions')
    // select output tab
    await selectTab(page,'Output')

    // add citations using doi
    for (const item of citations.dois.output) {
      await addCitation(page, item, 'output_for_project')
    }
  })

  test('Related projects', async ({page}, {project: {name}}) => {
    const project = mockProject[name]

    // directly open edit software page
    const url = `/projects/${project.slug}`
    await openEditPage(page, url, project.title)

    // await page.pause()
    // navigate to organisations section
    await openEditSection(page, 'Related projects')

    await addRelatedProject(page, 'project_for_project')
  })

  test('Related software', async ({page}, {project: {name}}) => {
    const project = mockProject[name]

    // directly open edit software page
    const url = `/projects/${project.slug}`
    await openEditPage(page, url, project.title)

    // await page.pause()
    // navigate to organisations section
    await openEditSection(page, 'Related software')

    // add related software only if not added
    const relatedSoftware = page.getByTestId('related-software-item')
    const initCnt = await relatedSoftware.count()
    if (initCnt === 0) {
      await addRelatedSoftware(page, 'software_for_project')
    }
  })
})

