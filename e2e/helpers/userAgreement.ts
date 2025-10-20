// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {expect, Page} from '@playwright/test'

export async function acceptUserAgreementModal(page: Page) {

  // find user agreement modal
  const uaModal = await page.getByTestId('user-agreement-modal')
  const uaModalHead = await page.getByRole('heading', { name: 'User agreements' })
  // check if user agreement modal is shown
  if (await uaModal.isVisible() === false && await uaModalHead.isVisible()===false) {
    return false
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

    // click OK button AND
    // confirm patch request done
    await Promise.all([
      page.waitForRequest(req => req.method() === 'PATCH'),
      // after click
      okBtn.click()
    ])
    // return true
    return true
  }
  // return false
  return false
}

export async function acceptUserAgreement(page:Page,baseURL?:string){
  // wait 700 ms to be sure all renders settled
  await page.waitForTimeout(700)

  // try modal first
  const accepted = await acceptUserAgreementModal(page)
  if (accepted) return true

  // else navigate to user settings agreements section
  await page.goto('/user/settings?settings=agreements')
  // wait for user agreements form to be attached
  await page.waitForSelector("#user-agreements-form",{state:"attached"})

  // get terms switch
  const termsCheckbox = await page.getByRole('switch', { name: 'I agree to the Terms of' })
  if (await termsCheckbox.isVisible()){
    // accept if not accepted
    if (await termsCheckbox.isChecked()===false){
      await termsCheckbox.check()
    }
  }

  // get privacy checkbox
  const privacyCheckbox = await page.getByRole('switch', { name: 'I have read the Privacy' })
  if (await privacyCheckbox.isVisible()){
    // accept if not accepted
    if (await privacyCheckbox.isChecked()===false){
      await privacyCheckbox.check()
    }
  }

  // check if both terms checked
  if (await termsCheckbox.isChecked()===true && await privacyCheckbox.isChecked()===true){
    return true
  }
  // if we are here this did not worked
  return false
}