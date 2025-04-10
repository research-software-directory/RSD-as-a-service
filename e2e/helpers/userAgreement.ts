// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {expect, Page} from '@playwright/test'

// ONLY after login
export async function acceptUserAgreementInSettings(page: Page) {
  // open user menu
  await page.getByTestId('user-menu-button').click()
  // click My settings menu option
  const mySettings = page.getByRole('menuitem', {name: 'My settings'})

  // open user/settings page
  await Promise.all([
    page.waitForURL('**/user/settings'),
    mySettings.click()
  ])

  // await page.pause()
  // find reference to form
  const uaForm = page.locator('#profile-settings-form')
  // find checkboxes
  const checkboxes = await uaForm.getByTestId('controlled-switch-label').all()
  expect(checkboxes.length).toBeGreaterThan(0)
  // const checkboxes = await page.getByTestId('controlled-switch-label').all()
  // expect(checkboxes.length).toBeGreaterThan(0)
  // check/accept all options
  for (const checkbox of checkboxes) {
    await checkbox.check()
  }
}

export async function acceptUserAgreement(page: Page) {
  // wait for user agreement api call
  const uaModal = page.getByTestId('user-agreement-modal')

  // check if user agreement modal is shown
  if (await uaModal.isVisible() === false) {
    // await page.pause()
    return true
  }

  // find checkboxes
  const checkboxes = await uaModal.getByTestId('controlled-switch-label').all()

  if (checkboxes.length > 0) {
    // await page.pause()
    // check/accept all options
    for (const checkbox of checkboxes) {
      if (await checkbox.isChecked() === false) {
        await checkbox.check()
      }
    }

    // get OK button
    const okBtn = uaModal.getByRole('button', {name: 'Accept'})

    // we need to wait for state to change
    await okBtn.waitFor({state:'visible'})
    expect(await okBtn.isEnabled()).toBe(true)

    // click OK button
    okBtn.click()
    await Promise.all([
      page.waitForRequest(req => req.method() === 'PATCH')
    ])
  }
}
