// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from './logger'

export function getHostnameFromUrl(link: string) {
  try {
    const url = new URL(link)
    return url.hostname
  } catch (e:any) {
    logger(`getHostname...${e.message}`, 'error')
    return null
  }
}
