// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {test} from '@playwright/test'
import {loginLocal, validateUserName} from '../helpers/login'

// use to quickly switch to http://localhost:3000 (frontend dev)
const url='/'

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

  test('Local user4', async ({page}) => {
    // username
    const userName = 'user4'
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

  test('Local user5', async ({page}) => {
    // username
    const userName = 'user5'
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

// ONLY WITH LOCAL TESTS - on CI SURFconext definitions/secrets are not present
// test.describe.parallel('SURFconext multiple users', async () => {
//   // remove cookies obtained by globalSetup
//   test.use({storageState: {cookies: [], origins: []}})

//   test('SURFconext JRB', async ({page},{}) => {
//     // username
//     const userName = 'Jordan Ross Belfort'
//     // test user
//     const user = {
//       username: 'professor1',
//       password: 'professor1'
//     }
//     // start from homepage
//     await page.goto('/')
//     // decline matomo
//     await page.getByRole('button', {
//       name: 'Decline'
//     }).click()
//     // logout user
//     // await logoutUser(page)
//     // login user
//     await loginToRsdUsingSurf({
//       page,
//       ...user
//     })
//     // validate user name
//     await validateUserName(page, userName)
//   })

//   test('SURFconext SAW', async ({page}) => {
//     // username
//     const userName = 'Steve Alen Wynn'
//     // test user
//     const user = {
//       username: 'professor2',
//       password: 'professor2'
//     }
//     // start from homepage
//     await page.goto('/')
//     // decline matomo
//     await page.getByRole('button', {
//       name: 'Decline'
//     }).click()
//     // logout user
//     // await logoutUser(page)
//     // login user
//     await loginToRsdUsingSurf({
//       page,
//       ...user
//     })
//     // validate user name
//     await validateUserName(page, userName)
//   })

//   test('SURFconext SIN', async ({page}) => {
//     // username
//     const userName = 'Sir Isaac Newton'
//     // test user
//     const user = {
//       username: 'professor3',
//       password: 'professor3'
//     }
//     // start from homepage
//     await page.goto('/')
//     // decline matomo
//     await page.getByRole('button', {
//       name: 'Decline'
//     }).click()
//     // logout user
//     // await logoutUser(page)
//     // login user
//     await loginToRsdUsingSurf({
//       page,
//       ...user
//     })
//     // validate user name
//     await validateUserName(page, userName)
//   })

//   test('SURFconext GSO', async ({page}) => {
//     // username
//     const userName = 'Prof. Dr. Georg Simon Ohm'
//     // test user
//     const user = {
//       username: 'professor4',
//       password: 'professor4'
//     }
//     // start from homepage
//     await page.goto('/')
//     // decline matomo
//     await page.getByRole('button', {
//       name: 'Decline'
//     }).click()
//     // logout user
//     // await logoutUser(page)
//     // login user
//     await loginToRsdUsingSurf({
//       page,
//       ...user
//     })
//     // validate user name
//     await validateUserName(page, userName)
//   })

//   test('SURFconext JDR', async ({page}) => {
//     // username
//     const userName = 'John Davison Rockefeller'
//     // test user
//     const user = {
//       username: 'professor5',
//       password: 'professor5'
//     }
//     // start from homepage
//     await page.goto('/')
//     // decline matomo
//     await page.getByRole('button', {
//       name: 'Decline'
//     }).click()
//     // logout user
//     // await logoutUser(page)
//     // login user
//     await loginToRsdUsingSurf({
//       page,
//       ...user
//     })
//     // validate user name
//     await validateUserName(page, userName)
//   })

//   test('SURFconext SO', async ({page}) => {
//     // username
//     const userName = 'Student One'
//     // test user
//     const user = {
//       username: 'student1',
//       password: 'student1'
//     }
//     // start from homepage
//     await page.goto('/')
//     // decline matomo
//     await page.getByRole('button', {
//       name: 'Decline'
//     }).click()
//     // logout user
//     // await logoutUser(page)
//     // login user
//     await loginToRsdUsingSurf({
//       page,
//       ...user
//     })
//     // validate user name
//     await validateUserName(page, userName)
//   })
// })
