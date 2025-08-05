// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {expect, Page} from '@playwright/test'

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
