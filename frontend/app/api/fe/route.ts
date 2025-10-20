// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import app from '../../../package.json'
/**
 * GET api/fe basic info
 */
export async function GET() {
  return Response.json({
    module: 'frontend/api',
    rsd_version: process.env.RSD_VERSION || 'MISSING',
    package_version: app?.version,
    status:'live'
  })
}
