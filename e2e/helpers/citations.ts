// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-var-requires */

import {expect} from '@playwright/test'
import {generateFileName, saveFile} from './save'

export async function addCitation(page, input: string, waitForResponse: string) {
  // await page.pause()
  // clear previous input - if clear btn is visible
  const clearBtn = await page.getByRole('button', {
    name: 'Clear'
  }).first()
  if (await clearBtn.isVisible() === true) {
    // clear selection
    await clearBtn.click()
  }

  await listenForDoiCalls(page,input)

  // start new search
  const findMention = await page.locator('#async-autocomplete').first()
  await Promise.all([
    // then wait untill options list is shown
    // page.waitForSelector('#async-autocomplete-listbox'),
    // change to wait untill network traffic settles
    page.waitForLoadState('networkidle'),
    // page.waitForSelector('#async-autocomplete-option-1'),
    findMention.fill(input),
  ])

  // select all options
  const options = page.getByTestId('find-mention-option')
  const option = await options
    .filter({
      hasText: RegExp(input, 'i')
    })
    .first()

  await Promise.all([
    page.waitForResponse(RegExp(waitForResponse, 'i')),
    page.waitForLoadState('domcontentloaded'),
    option.click(),
  ])

  // validate mention item added
  // retry untill test pass
  await expect(async () => {
    const count = await page.getByTestId('mention-item-base')
      .filter({
        hasText: RegExp(input, 'i')
      })
      .count()
    // console.log('Count...', count)
    // stop here
    // await page.pause()
    // we should have our item in list
    expect(count).toEqual(1)
  }).toPass()
}


async function listenForDoiCalls(page,input:string) {
  // monitor api calls
  // console.log('input...', input)
  await page.route(`https://doi.org/doiRA/${input}`, async route => {
    // const url = route.request().url()
    // console.log('doi.org...url...', url)
    const filename = `mocks/data/doi_${generateFileName(input)}.json`
    // mock route response with local data file
    await route.fulfill({path:filename})
  })
  await page.route(`https://api.crossref.org/works/${input}`, async route => {
    // const url = route.request().url()
    // console.log('crossref...url...', url)
    const filename = `mocks/data/crossref_${generateFileName(input)}.json`
    // mock route response with local data file
    await route.fulfill({path: filename})
  })
  await page.route('https://api.datacite.org/graphql', async route => {
    // const url = route.request().url()
    // console.log('datacite...url...', url)
    const filename = `mocks/data/datacite_${generateFileName(input)}.json`
    // mock route response with local data file
    await route.fulfill({path: filename})
  })
}


export async function saveCitation(page, input: string, waitForResponse: string) {
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
  const findMention = await page.locator('#async-autocomplete').first()
  await Promise.all([
    // then wait untill options list is shown
    page.waitForSelector('#async-autocomplete-listbox'),
    findMention.fill(input),
  ])

  // get list
  const listbox = page.locator('#async-autocomplete-listbox')
  // select all options
  const options = listbox.getByRole('option')
  const option = await options
    .filter({
      hasText: RegExp(input, 'i')
    })
    .first()

  await Promise.all([
    page.waitForResponse(RegExp(waitForResponse)),
    option.click(),
  ])

  // validate
  const mentions = await page.getByTestId('mention-item-base')
    .filter({
      hasText: RegExp(input, 'i')
    })

  const count = await mentions.count()
  // console.log('Count...', count)
  // we should have at least one item
  expect(count).toBeGreaterThan(0)
}

export async function generateJsonFromApiCalls(page, input: string) {
  // monitor api calls
  // console.log('input...', input)
  await page.route(`https://doi.org/doiRA/${input}`, async route => {
    // const url = route.request().url()
    // console.log('doi.org...url...', url)
    const resp = await route.fetch()
    const json = await resp.json()
    // generate filename
    const filename = `mocks/data/doi_${generateFileName(input)}.json`
    // save json
    saveFile(filename, JSON.stringify(json))
    // continue
    route.continue()
  })
  await page.route(`https://api.crossref.org/works/${input}`, async route => {
    // const url = route.request().url()
    // console.log('crossref...url...', url)
    const resp = await route.fetch()
    const json = await resp.json()
    // generate filename
    const filename = `mocks/data/crossref_${generateFileName(input)}.json`
    // save json
    saveFile(filename, JSON.stringify(json))
    // continue
    route.continue()
  })
  await page.route('https://api.datacite.org/graphql', async route => {
    // const url = route.request().url()
    // console.log('datacite...url...', url)
    const resp = await route.fetch()
    const json = await resp.json()
    // generate filename
    const filename = `mocks/data/datacite_${generateFileName(input)}.json`
    // save json
    saveFile(filename, JSON.stringify(json))
    // continue
    route.continue()
  })
}
