// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {Dispatch, SetStateAction} from 'react'

// refresh schedule margin 5min. before expiration time
// REFRESH_MARGIN_MSEC env variable is used for test purposes ONLY
const testMargin = process.env.REFRESH_MARGIN_MSEC ? Number.parseInt(process.env.REFRESH_MARGIN_MSEC) : undefined
export const REFRESH_MARGIN = testMargin ?? 5 * 60 * 1000
export type RsdRole = 'rsd_admin' | 'rsd_user'
export type RsdUserData = {
  [property: string]: string[]
}
export type RsdUser = {
  iss: 'rsd_auth'
  role: RsdRole
  // expiration time
  exp: number
  // uid
  account: string
  // display name
  name: string,
  data?: RsdUserData,
}

export type Session = {
  user: RsdUser | null,
  token: string,
  status: 'authenticated' | 'missing' | 'invalid' | 'expired' | 'jwtkey' | 'loading',
}

export type AuthSession = {
  session: Session,
  setSession: Dispatch<SetStateAction<Session>>
}

export const defaultSession:Session={
  user: null,
  token: '',
  status: 'missing'
}

export const initSession: AuthSession = {
  session: defaultSession,
  setSession: () => defaultSession
}
