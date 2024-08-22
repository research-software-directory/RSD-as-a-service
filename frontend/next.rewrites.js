// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

// proxy to nginx service when running as frontend-dev docker service
// proxy to localhost when in standalone development mode (npm run dev)

// console.log('process.env.NODE_ENV',process.env.NODE_ENV)
// console.log('process.env.PWD', process.env.PWD)

let rewritesConfig = []
if (process.env.NODE_ENV === 'docker') {
  // proxies for frontend-dev service
  // developing using node docker container
  rewritesConfig=[
    {
      source: '/image/:path*',
      destination: 'http://nginx/image/:path*',
    },
    {
      source: '/api/v1/:path*',
      destination: 'http://nginx/api/v1/:path*',
    },
    {
      source: '/auth/login/local',
      destination: 'http://nginx/auth/login/local',
    }
  ]
} else if (process.env.NODE_ENV === 'development'){
  rewritesConfig = [
    {
      source: '/image/:path*',
      destination: 'http://localhost/image/:path*',
    },
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost/api/v1/:path*',
    },
    {
      source: '/auth/login/local',
      destination: 'http://localhost/auth/login/local',
    },
    {
      source: '/documentation/:path*',
      destination: 'http://localhost/documentation/:path*',
    }
  ]
}

// console.log('rewritesConfig...', rewritesConfig)

module.exports = rewritesConfig
