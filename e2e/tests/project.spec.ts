// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {test, expect} from '@playwright/test'
import {
  addFundingOrganisation, addKeyword, addResearchDomain,
  createProject, createProjectLink, createTeamMember,
  editProjectInput, importTeamMemberByOrcid,
  openEditTeamPage
} from '../helpers/project'
import {mockProject} from '../mocks/mockProject'
import {addCitation, addRelatedProject, addRelatedSoftware, openEditPage, openEditSection, uploadFile} from '../helpers/utils'
import {getDusanMijatovic, getRandomPerson} from '../mocks/mockPerson'
import {addOrganisation} from '../helpers/utils'
import {mockProjectOrganisation} from '../mocks/mockOrganisation'
import {mockCitations} from '../mocks/mockCitations'

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

  test('Add organisations', async ({page}, {project}) => {
    // get mock software for the browser
    const proj = mockProject[project.name]
    const organisations = mockProjectOrganisation[project.name]

    // directly open edit software page
    const url = `/projects/${proj.slug}`
    await openEditPage(page, url, proj.title)

    // navigate to organisations section
    await openEditSection(page,'Organisations')

    // create organisations
    for (const org of organisations) {
      await addOrganisation(page, org, 'project_for_organisation')
    }
    // check the count
    const count = await page.getByTestId('organisation-list-item').count()
    expect(count).toBeGreaterThanOrEqual(organisations.length)
  })

  test('Edit project info', async ({page},{project}) => {
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

    // take reference to view page button
    const viewPage = page.getByRole('button', {
      name: 'view page'
    })
    // just click on view page to close
    await viewPage.click()
  })

  test('Edit team members', async ({page},{project}) => {
    // get mock project for the browser
    const proj = mockProject[project.name]
    // get mock software for the browser
    const contact = getRandomPerson(project.name)
    const dusan = getDusanMijatovic(project.name)

    // open project edit page using edit button
    const url = `/projects/${proj.slug}`
    await openEditPage(page, url, proj.title)

    // open edit project page from overview
    // it does not allways show items?!?
    // await openEditProjectPage(page, `Test project ${project.name}`)

    // open edit team members page
    await openEditTeamPage(page)
    // create new team member
    await createTeamMember(page,contact)
    // import team member from ORCID
    // uses real name and orcid for validation
    await importTeamMemberByOrcid(page, dusan)
  })

  test('Add impact', async ({page}, {project: {name}}) => {
    // get mock software for the browser
    const project = mockProject[name]
    const citations = mockCitations[name]

    // directly open edit software page
    const url = `/projects/${project.slug}`
    await openEditPage(page, url, project.title)

    // navigate to organisations sectiont
    await openEditSection(page, 'Impact')

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
    await openEditSection(page, 'Output')

    // add citations using doi
    for (const item of citations.dois.output) {
      await addCitation(page, item, 'output_for_project')
    }
  })

  test('Related items', async ({page}, {project: {name}}) => {
    const project = mockProject[name]

    // directly open edit software page
    const url = `/projects/${project.slug}`
    await openEditPage(page, url, project.title)

    // await page.pause()
    // navigate to organisations section
    await openEditSection(page, 'Related topics')

    await addRelatedProject(page, 'project_for_project')

    // add related software only if not added
    const relatedSoftware = page.getByTestId('related-software-item')
    const initCnt = await relatedSoftware.count()
    if (initCnt === 0) {
      await addRelatedSoftware(page, 'software_for_project')
    }
  })
})

