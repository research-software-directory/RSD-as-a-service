// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {Rewrite} from 'next/dist/lib/load-custom-routes'

// proxy to nginx service when running as frontend-dev docker service
// proxy to localhost when in standalone development mode (npm run dev)

// console.log('process.env.NODE_ENV',process.env.NODE_ENV)
// console.log('process.env.PWD', process.env.PWD)

let rewritesConfig: Rewrite[] = [] // NOSONAR

if (process.env.NODE_ENV === 'development') {
  rewritesConfig = [
    {
      source: '/image/:path*',
      destination: 'http://localhost/image/:path*', // NOSONAR
    },
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost/api/v1/:path*', // NOSONAR
    },
    {
      source: '/auth/:path*',
      destination: 'http://localhost/auth/:path*', // NOSONAR
    },
    {
      source: '/documentation/:path*',
      destination: 'http://localhost/documentation/:path*', // NOSONAR
    }
  ]
}

// console.log('rewritesConfig...', rewritesConfig)

export default rewritesConfig
