// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {test} from '@playwright/test'
import {loginLocal, validateUserName} from '../helpers/login'
import {acceptUserAgreement} from '../helpers/userAgreement'

// start from software page because home redirects to user profile and that triggers
// user agreement too fast
const url='/'

test.describe.serial('Login multiple local users', async () => {
  // remove cookies obtained by globalSetup
  test.use({storageState: {cookies: [], origins: []}})

  test('Local user1', async ({page}) => {
    // username
    const userName = 'user1'
    // start from homepage
    // await page.goto('/')
    await page.goto(url)
    // decline matomo
    await page.getByRole('button', {
      name: 'Decline'
    }).click()
    // login user
    await loginLocal({
      page,
      username: userName
    })
    // after login user is send to settings
    // for "normal" users the modal will appear automatically
    // to accept user agreement (if modal present)
    // if modal does not appears we receive FALSE
    // accept user agreement on settings page
    await acceptUserAgreement(page)

    // validate user name
    await validateUserName(page, userName)
  })

  test('Local user2', async ({page}) => {
    // username
    const userName = 'user2'
    // start from homepage
    // await page.goto('/')
    await page.goto(url)
    // decline matomo
    await page.getByRole('button', {
      name: 'Decline'
    }).click()
    // login user
    await loginLocal({
      page,
      username: userName
    })
    // after login user is send to settings
    // for "normal" users the modal will appear automatically
    // to accept user agreement (if modal present)
    // if modal does not appears we receive FALSE
    // accept user agreement on settings page
    await acceptUserAgreement(page)

    // validate user name
    await validateUserName(page, userName)
  })

  test('Local user3', async ({page}) => {
    // username
    const userName = 'user3'
    // start from homepage
    // await page.goto('/')
    await page.goto(url)
    // decline matomo
    await page.getByRole('button', {
      name: 'Decline'
    }).click()
    // logout user
    // await logoutUser(page)
    // login user
    await loginLocal({
      page,
      username: userName
    })
    // after login user is send to settings
    // for "normal" users the modal will appear automatically
    // to accept user agreement (if modal present)
    // if modal does not appears we receive FALSE
    // accept user agreement on settings page
    await acceptUserAgreement(page)
    
    // validate user name
    await validateUserName(page, userName)
  })

})
