// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {test} from '@playwright/test'
import {loginLocal, validateUserName} from '../helpers/login'

// start from software page because home redirects to user profile and that triggers
// user agreement too fast
const url='/software'

test.describe.parallel('Login multiple local users', async () => {
  // remove cookies obtained by globalSetup
  test.use({storageState: {cookies: [], origins: []}})

  test('Local admin1', async ({page}) => {
    // username
    const userName = 'admin1'
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
    // validate user name
    await validateUserName(page,userName)
  })

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
    // logout user
    // await logoutUser(page)
    // login user
    await loginLocal({
      page,
      username: userName
    })
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
    // logout user
    // await logoutUser(page)
    // login user
    await loginLocal({
      page,
      username: userName
    })
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
    // validate user name
    await validateUserName(page, userName)
  })

})
