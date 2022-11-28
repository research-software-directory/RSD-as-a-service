// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {expect, Locator, Page} from '@playwright/test'

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
  file: string, imageSelector='[role="img"]') {
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
