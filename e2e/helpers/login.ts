// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Page, expect} from '@playwright/test'
import { acceptUserAgreement } from './userAgreement'

type LocalLogin = {
  page: Page,
  username: string,
}

type LoginProps = LocalLogin & {
  password: string
}

export const user = {
  name: 'professor1',
  password: 'professor1'
}

// the admin email is defined
// in .env file
export const localAdmin = {
  name: 'admin1',
  email: 'admin1@example.com'
}

// the admin email is defined
// in .env file
export const surfAdmin = {
  name: 'professor3',
  password: 'professor3',
  email: 'isaacnewton@university-example.org'
}


export async function loginToRsdUsingSurf({
  page,username,password
}:LoginProps) {
  // sign in
  await page.getByRole('button', {
    name: 'Sign in'
  }).click()
  await page.getByRole('link', {
    name: 'SURFconext Sign in with SURFconext',
    exact: false
  }).click()
  // find SURFconext test IdP
  await page.getByPlaceholder('Search...').fill('surf')
  // get surf buton
  const surfBtn = page.getByRole('heading', {
    name: 'Login with SURFconext Test IdP'
  })
  // click on button
  await surfBtn.click()
  // type in
  await page.getByLabel('Username').fill(username)
  // await page.getByLabel('Username').press('Tab');
  await page.getByLabel('Password').fill(password)
  // await page.getByRole('cell', { name: 'Login' }).click();
  // click on the login button
  const loginBtn = page.getByRole('button', {
    name: 'Login'
  })
  // open edit page
  await Promise.all([
    // click to login button
    loginBtn.click(),
    // wait untill all network calls done
    page.waitForLoadState('networkidle')
  ])
  // just return
  return true
}

export async function loginLocal({
  page, username
}: LocalLogin) {
  // sign in
  await page.getByRole('button', {
    name: 'Sign in'
  }).click()
  // select local account
  await page.getByRole('link', {
    name: 'Local account Sign in with local account'
  }).click()
  // fill in user name
  await page.getByLabel('Username *').fill(username)
  // click on login button
  const loginBtn = page.getByRole('button', {
    name: 'Login'
  })
  // open edit page
  await Promise.all([
    // click to login button
    loginBtn.click(),
    // wait untill all network calls done
    page.waitForLoadState('networkidle')
  ])
  // just return
  return true
}

export async function logoutUser(page: Page) {
  // logout user if exists
  const userBtnCnt = await page.getByTestId('user-menu-button').count()
  if (userBtnCnt > 0) {
    await page.getByTestId('user-menu-button').click()
    await page.getByRole('menuitem', {name: 'Logout'}).click()
  }
}

export async function validateUserName(page: Page, name: string, debug=false) {
  // accept user agreement if present (due to redirect to user page)
  await acceptUserAgreement(page)
  // navigate to settings
  await page.getByTestId('user-menu-button').click()
  await page.getByRole('menuitem', {name: 'My settings'}).click()
  // accept user agreement if modal present (it shows on first login)
  await acceptUserAgreement(page)
  // get user name from user page header
  const userName = await page.getByTestId('user-settings-h1').innerText()
  // we stop here (need to be in debug mode)
  if (debug === true && userName !== name) {
    await page.pause()
  }
  // validate user name
  expect(userName).toEqual(name)
}
