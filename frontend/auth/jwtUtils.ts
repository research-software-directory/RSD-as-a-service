// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import jwt from 'jsonwebtoken'
import logger from '~/utils/logger'

// secret key is only available in Node (backend=SSR)
const jwtKey = process.env.PGRST_JWT_SECRET

const verifyOptions = {
  // issuer should be rsd_auth
  issuer: 'rsd_auth',
  // subject - not provided
  subject: undefined,
  // audience - not provided
  audience: undefined,
  // expiration time can be 1m (60sec) 1h (1 hour), 1d (1 day) etc see documentation
  expiresIn: '1h',
  // required algo to use
  // RS256 uses private/public keys
  // algorithm: 'RS256',
}

export function decodeJwt(token: string) {
  return jwt.decode(token)
}

export function getAccountFromToken(token?: string) {
  if (token) {
    const user = jwt.decode(token) as any
    return {
      account: user?.account as string,
      role: user?.role as string
    }
  }
  return undefined
}

/**
 * Verify JWT. USE ONLY ON THE SERVER SIDE (only from getServerSideProps function or api).
 * jwt secret is available only in Node mode (backend mode).
 * @param token
 * @returns boolean | undefined
 */
export default function verifyJwt(token: string): 'valid' | 'invalid' | 'jwtkey' {
  try {
    // if the key is not available we might be in FE mode
    if (!jwtKey) return 'jwtkey'
    const verified = jwt.verify(token, jwtKey, verifyOptions)
    // for now we just check for object
    if (verified && typeof verified === 'object') {
      return 'valid'
    }
    logger(`verifyJwt response: ${verified}`, 'warn')
    return 'invalid'
  } catch (e: any) {
    logger(`verifyJwt failed: ${e?.message}`, 'error')
    return 'invalid'
  }
}
