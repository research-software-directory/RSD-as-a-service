// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export function localInfo() {
  return {
    name: 'Local account',
    redirectUrl: '/login/local',
    html: `
      <p>Sign in with local account is <strong>for testing purposes only</strong>.
      This option should not be enabled in the production version.</p>
    `
  }
}
