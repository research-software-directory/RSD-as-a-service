// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {NextApiRequest} from 'next/types'

export type Error={
  message: string
}

export function extractParam(req: NextApiRequest, param: string) {
  // load parameter
  const p = req.query[param]
  if (p) {
    // if exists
    if (typeof p === 'string') {
      return p
    } else {
      return p.toString()
    }
  }
  return ''
}
