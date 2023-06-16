// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {expect, Locator, Page} from '@playwright/test'
import {Organisation} from '../mocks/mockOrganisation'

/**
 * Generate random id
 * @param factor
 * @returns number
 */
export function generateId(factor=100000){
  const id = Math.round(Math.random() * factor)
  return id
}

type InputProps = {
  page: Page
  element: Locator
  value: string
}

export async function fillAutosaveInput({page, element, value}: InputProps) {
  await element.fill(value)
  await Promise.all([
    page.waitForRequest(req => req.method() === 'PATCH'),
    element.blur()
  ])
}

/**
 * Open software/project edit page using edit button on the project page
 * @param page
 * @param url
 * @param title
 * @returns
 */
export async function openEditPage(page: Page, url: string, title: string) {
  // navigate to pageo
  await page.goto(url)
  // get page title
  const pageTitle = await page.getByRole('heading', {
    name: title,
    level: 1
  }).textContent()
  // validate we are on the page
  expect(pageTitle).toEqual(title)
  // find edit button
  const editBtn = await page.getByTestId('edit-button')
  // click edit and wait to settle
  await Promise.all([
    page.waitForLoadState('networkidle'),
    editBtn.click()
  ])
}

/**
 *  Upload image file using specified selector and the file location
 * @param page
 * @param selector
 * @param file
 * @returns
 */
export async function uploadFile(page: Page, inputSelector: string,
  file: string, imageSelector = '[role="img"]') {
  // breakpoint
  // await page.pause()

  await Promise.all([
    page.setInputFiles(inputSelector, [file]),
    // page.waitForLoadState("networkidle")
    page.waitForSelector(imageSelector)
  ])
  return true
}

export function createMarkdown(browser) {
return `
## Test software ${browser}

This is test software markdown test.

## Second header
Second level header here!

`
}

export async function openEditSection(page:Page,name:string) {
  // open contributors section
  await Promise.all([
    // we need to wait for authentication response to settle
    page.waitForLoadState('networkidle'),
    page.getByRole('button', {
      name
    }).click()
  ])

}

// TODO! REMOVE THIS FUNCTION LATER
// export async function addOrganisation(page, organisation: Organisation, apiUrl) {

//   // const findOrganisation = page.getByLabel('Find or add organisation')
//   const findOrganisation = page.getByRole('combobox', {name: 'Find or add organisation'})

//   // check if no organisation message is present
//   const alert = await page.getByRole('alert')
//     .filter({
//       hasText: /No participating organisations/
//     }).count() > 0

//   // set breakpoint
//   // console.log('alert...', alert)
//   // await page.pause()

//   if (alert === false) {
//     //check if organisation already present
//     const organisations = page.getByTestId('organisation-list-item')
//     const [count] = await Promise.all([
//       organisations.count(),
//       page.waitForLoadState('networkidle')
//     ])

//     if (count > 0) {
//       // check if organisation existis
//       const found = await organisations
//         .filter({hasText: RegExp(organisation.name)})
//         .count()
//       // console.log('found...', found)
//       // if already exists we return false
//       if (found > 0) return false
//     }
//   }

//   // if not exists we search
//   await Promise.all([
//     page.waitForResponse(/api.ror.org\/organizations/),
//     page.waitForLoadState('networkidle'),
//     findOrganisation.fill(organisation.name)
//   ])

//   const options = page.getByTestId('find-organisation-option')
//   const option = await options
//     .filter({
//       hasText:RegExp(organisation.name,'i')
//     })
//     .first()

//   // get source information
//   const source = await option.getByTestId('organisation-list-item').getAttribute('data-source')

//   if (source === 'RSD') {
//     await Promise.all([
//       page.waitForResponse(RegExp(apiUrl)),
//       option.click()
//     ])
//     // if rsd we just add it to list (no modal popup)
//     return true
//   }
//   if (source === 'ROR') {
//     // for ROR we can upload logo
//     // in the modal/dialog so
//     // we wait on modal to appear
//     await Promise.all([
//       page.waitForSelector('[role="dialog"]'),
//       option.click()
//     ])

//     // console.log('logo...', organisation.logo)
//     // upload logo if logo provided
//     if (organisation.logo) {
//       await uploadFile(
//         page, '#upload-avatar-image',
//         organisation.logo,
//         'img'
//       )
//     }
//     // save new organisation
//     const saveBtn = page.getByRole('button', {
//       name: 'Save'
//     })
//     await Promise.all([
//       page.waitForResponse(/organisation/),
//       page.waitForResponse(RegExp(apiUrl)),
//       saveBtn.click()
//     ])
//   }

//   // validate item is added to list
//   const lastItem = await page.getByTestId('organisation-list-item').last()
//   const lastText = await lastItem.getByTestId('organisation-list-item-text').textContent()
//   // console.log('lastText...', lastText)
//   expect(lastText).toContain(organisation.name)

//   return true
// }

export async function addRelatedSoftware(page: Page, waitForResponse:string) {
  const findSoftware = page
    .getByTestId('find-related-software')
    .locator('#async-autocomplete')

  await Promise.all([
    page.waitForResponse(/software/),
    findSoftware.fill('software')
  ])

  // get related options
  const options = page.getByTestId('related-software-option')
  const count = await options.count()
  // initially there will no be items
  if (count > 0) {
    // set breakpoint
    // await page.pause()
    // check alredy selected
    const relatedSoftware = page.getByTestId('related-software-item')
    const initCnt = await relatedSoftware.count()
    if (initCnt > 0) {
      // select last item
      await Promise.all([
        page.waitForResponse(RegExp(waitForResponse)),
        options.last().click()
      ])
    } else {
      // select first item
      await Promise.all([
        page.waitForResponse(RegExp(waitForResponse)),
        options.first().click()
      ])
    }
    // expect item count to be increased
    const itemsCnt = await relatedSoftware.count()
    expect(itemsCnt).toBeGreaterThan(initCnt)
  }
}

export async function addRelatedProject(page: Page, waitForResponse:string) {
  const findSoftware = page
    .getByTestId('find-related-project')
    .locator('#async-autocomplete')

  await Promise.all([
    page.waitForResponse(/project/),
    findSoftware.fill('project')
  ])

  // get related options
  const options = page.getByTestId('related-project-option')
  const count = await options.count()
  // initially there will no be items
  if (count > 0) {
    // expect at least one item
    const relatedProjects = page.getByTestId('related-project-item')
    const initCnt = await relatedProjects.count()
    if (initCnt > 0) {
      // select last item
      await Promise.all([
        page.waitForResponse(RegExp(waitForResponse)),
        options.last().click()
      ])
    } else {
      // select first item
      await Promise.all([
        page.waitForResponse(RegExp(waitForResponse)),
        options.first().click()
      ])
    }
    const itemsCnt = await relatedProjects.count()
    expect(itemsCnt).toBeGreaterThan(initCnt)
  }
}
