// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Page, expect} from '@playwright/test'
import {uploadFile} from './utils'
import {generateFileName, saveFile} from './save'
import {Organisation} from '../mocks/mockOrganisation'


export async function addFundingOrganisation(page: Page, organisation: string) {
  const fundingInput = page.getByRole('combobox', {name: 'Find funding organisation'})

  // we mock ror api response
  await listenForRoRCalls(page, organisation)

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
      hasText: RegExp(organisation, 'i')
    })
    .first()

  await Promise.all([
    // select first option
    option.click(),
    // wait for api update
    page.waitForRequest(/\/project_for_organisation/)
  ])
}


export async function addOrganisation(page, organisation: Organisation, apiUrl) {

  const findOrganisation = page.getByRole('combobox', {name: 'Find or add organisation'})

  // check if no organisation message is present
  const alert = await page.getByRole('alert')
    .filter({
      hasText: /No participating organisations/
    }).count() > 0

  // set breakpoint
  // console.log('alert...', alert)
  // await page.pause()

  if (alert === false) {
    //check if organisation already present
    const organisations = page.getByTestId('organisation-list-item')
    const [count] = await Promise.all([
      organisations.count(),
      page.waitForLoadState('networkidle')
    ])

    if (count > 0) {
      // check if organisation existis
      const found = await organisations
        .filter({hasText: RegExp(organisation.name)})
        .count()
      // console.log('found...', found)
      // if already exists we return false
      if (found > 0) return false
    }
  }

  // we mock ror api response
  await listenForRoRCalls(page, organisation.name)

  // if not exists we search
  await Promise.all([
    page.waitForResponse(/api.ror.org\/organizations/),
    page.waitForLoadState('networkidle'),
    findOrganisation.fill(organisation.name)
  ])

  const options = page.getByTestId('find-organisation-option')
  const option = await options
    .filter({
      hasText: RegExp(organisation.name, 'i')
    })
    .first()

  // get source information
  const source = await option.getByTestId('organisation-list-item').getAttribute('data-source')

  if (source === 'RSD') {
    await Promise.all([
      page.waitForResponse(RegExp(apiUrl)),
      option.click()
    ])
    // if rsd we just add it to list (no modal popup)
    return true
  }
  if (source === 'ROR') {
    // for ROR we can upload logo
    // in the modal/dialog so
    // we wait on modal to appear
    await Promise.all([
      page.waitForSelector('[role="dialog"]'),
      option.click()
    ])

    // console.log('logo...', organisation.logo)
    // upload logo if logo provided
    if (organisation.logo) {
      await uploadFile(
        page, '#upload-avatar-image',
        organisation.logo,
        'img'
      )
    }
    // save new organisation
    const saveBtn = page.getByRole('button', {
      name: 'Save'
    })
    await Promise.all([
      page.waitForResponse(/organisation/),
      page.waitForResponse(RegExp(apiUrl)),
      saveBtn.click()
    ])
  }

  // validate item is added to list
  const lastItem = await page.getByTestId('organisation-list-item').last()
  const lastText = await lastItem.getByTestId('organisation-list-item-text').textContent()
  // console.log('lastText...', lastText)
  expect(lastText).toContain(organisation.name)

  return true
}


async function listenForRoRCalls(page, input: string) {
  // monitor api calls
  // console.log('input...', input)
  await page.route(`https://api.ror.org/organizations?query=${encodeURIComponent(input)}`, async route => {
    // const url = route.request().url()
    // console.log('api.ror.org...url...', url)
    const filename = `mocks/data/ror_${generateFileName(input)}.json`
    // mock route response with local data file
    await route.fulfill({path: filename})
  })
}

export async function generateJsonFromApiCalls(page, input: string) {
  // monitor api calls
  // console.log('input...', input)
  await page.route(`https://api.ror.org/organizations?query=${encodeURIComponent(input)}`, async route => {
    // const url = route.request().url()
    // console.log('doi.org...url...', url)
    const resp = await route.fetch()
    const json = await resp.json()
    // generate filename
    const filename = `mocks/data/ror_${generateFileName(input)}.json`
    // save json
    saveFile(filename, JSON.stringify(json))
    // continue
    route.continue()
  })
}

// Generate local json files based on response received from api
// Use it locally to perform api calls
// Called from gen_project.spec.ts script
export async function saveOrganisation(page, input: string) {
  // find organisation input
  const findOrganisation = page.getByRole('combobox', {name: 'Find or add organisation'})

  // clear previous input - if clear btn is visible
  const clearBtn = await page.getByRole('button', {
    name: 'Clear'
  }).first()
  if (await clearBtn.isVisible() === true) {
    // clear selection
    await clearBtn.click()
  }

  await generateJsonFromApiCalls(page, input)

  // start new search

  // if not exists we search
  await Promise.all([
    page.waitForResponse(/api.ror.org\/organizations/),
    page.waitForLoadState('networkidle'),
    findOrganisation.fill(input)
  ])

  const options = page.getByTestId('find-organisation-option')
  const option = await options
    .filter({
      hasText: RegExp(input, 'i')
    })
    .first()

  // get source information
  const source = await option.getByTestId('organisation-list-item').getAttribute('data-source')

  // IF IN RSD we return directly
  if (source === 'RSD') return true
  if (source === 'ROR') return true

  return false
}
