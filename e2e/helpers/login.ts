// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Page} from '@playwright/test'

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
    // wait for navigation
    page.waitForNavigation(),
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
    page.waitForNavigation(),
    // wait untill all network calls done
    page.waitForLoadState('networkidle')
  ])
  // just return
  return true
}


export async function navigateToProfilePage({page}: { page: Page }) {
  await page.getByTestId('user-menu-button').click()
}
