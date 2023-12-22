// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {IncomingMessage} from 'http'
import logger from './logger'

// NOTE! dynamic methods return http is node because
// HTTPS is implemented in NGINX.
// All props I tried in Next return http all the time
export function getDomain(req: IncomingMessage) {
  try {
    const host = req.headers['host'] ?? 'localhost'
    // by default we use https protocol
    let protocol = 'https'

    if (host.startsWith('localhost')===true) {
      // we use http when local host
      protocol = 'http'
    }

    return `${protocol}://${host}`

  } catch (e: any) {
    logger(`getDomain...${e.message}`, 'error')
    return 'http://localhost:3000'
  }
}
