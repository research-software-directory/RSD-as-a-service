// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * DEFAULT MOCKS OF apiPackageManager methods
 */

import {PackageManagerSettings} from '../apiPackageManager'
import mockPackageManagers from './package_manager.json'

export const packageManagerSettings = {
  anaconda: {
    name: 'Anaconda',
    icon: '/images/anaconda-logo-96.svg',
    hostname: ['anaconda.org'],
    services: ['dependents']
  },
  cran: {
    name: 'CRAN',
    icon: '/images/cran-r-logo.svg',
    hostname: ['cran.r-project.org'],
    services: ['dependents']
  },
  crates: {
    name: 'Crates.io',
    icon: '/images/rust-cargo-logo.png',
    hostname: ['crates.io'],
    services: ['dependents']
  },
  chocolatey: {
    name: 'Chocolatey',
    icon: '/images/chocolatey-logo.svg',
    hostname: ['community.chocolatey.org'],
    services: []
  },
  debian:{
    name: 'Debian',
    icon: '/images/debian-logo.svg',
    hostname: ['packages.debian.org'],
    services: []
  },
  dockerhub: {
    name: 'Dockerhub',
    icon: '/images/dockerhub-logo.webp',
    hostname: ['hub.docker.com'],
    services: ['downloads']
  },
  github: {
    name: 'Github',
    icon: '/images/github-logo.svg',
    hostname: ['github.com'],
    services: []
  },
  gitlab: {
    name: 'Gitlab',
    icon: '/images/gitlab-icon-rgb.svg',
    hostname: ['gitlab.com','registry.gitlab.com'],
    services: []
  },
  golang: {
    name: 'Golang',
    icon: '/images/go-logo-blue.svg',
    hostname: ['pkg.go.dev'],
    services: ['dependents']
  },
  maven: {
    name: 'Maven',
    icon: '/images/apache-maven-logo.svg',
    hostname: ['mvnrepository.com'],
    services: ['dependents']
  },
  npm: {
    name: 'NPM',
    icon: '/images/npm-logo-64.png',
    hostname: ['www.npmjs.com','npmjs.com'],
    services: ['dependents']
  },
  pypi: {
    name: 'PyPi',
    icon: '/images/pypi-logo.svg',
    hostname: ['pypi.org'],
    services: ['dependents']
  },
  sonatype:{
    name: 'Sonatype',
    icon: '/images/sonatype-logo.svg',
    hostname: ['central.sonatype.com'],
    services: ['dependents']
  },
  snapcraft:{
    name: 'Snapcraft',
    icon: '/images/snapcraft-logo.svg',
    hostname: ['snapcraft.io'],
    services: []
  },
  other: {
    name: 'Other',
    icon: null,
    hostname: [],
    services: []
  }
}

export type PackageManagerTypes = keyof typeof packageManagerSettings


export type NewPackageManager = {
  id: string|null
  software: string,
  url: string,
  package_manager: PackageManagerTypes|null,
  position: number
}


export type PackageManager = NewPackageManager & {
  id: string,
  download_count: number | null,
  download_count_scraped_at: string | null,
  reverse_dependency_count: number | null,
  reverse_dependency_count_scraped_at: string | null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getPackageManagers({software, token}: { software: string, token: string }) {
  // console.log('getPackageManagers...default MOCK')
  return mockPackageManagers
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function postPackageManager({data, token}: { data: NewPackageManager, token: string }) {
  // console.log('postPackageManager...default MOCK')
  return {
    status: 200,
    message: 'OK'
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function patchPackageManagers({items, token}: { items: PackageManager[], token: string }) {
  // console.log('patchPackageManagers...default MOCK')
  return {
    status: 200,
    message: 'OK'
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deletePackageManager({id, token}: { id: string, token: string }) {
  // console.log('deletePackageManager...default MOCK')
  return {
    status: 200,
    message: 'OK'
  }
}

export async function getPackageManagerTypeFromUrl(url:string) {
  try {
    const urlObject = new URL(url)
    const keys = Object.keys(packageManagerSettings) as PackageManagerTypes[]

    // find first key to match the hostname
    const pm_key = keys.find(key => {
      const manager = packageManagerSettings[key as PackageManagerTypes] as PackageManagerSettings
      // match hostname
      return manager.hostname.includes(urlObject.hostname)
    })
    if (pm_key) {
      return pm_key
    }
    return 'other' as PackageManagerTypes
  } catch {
    return 'other' as PackageManagerTypes
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getPackageManagerServices(pm_key:PackageManagerTypes|null){
  // just return no services
  return []
}
