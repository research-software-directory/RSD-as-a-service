// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockPackageManagers from './package_manager.json'

export const packageManagerSettings = {
  anaconda: {
    name: 'Anaconda',
    icon: '/images/anaconda-logo-96.svg',
    hostname: ['anaconda.org']
  },
  cran: {
    name: 'CRAN',
    icon: '/images/cran-r-logo.svg',
    hostname: ['cran.r-project.org']
  },
  dockerhub: {
    name: 'Dockerhub',
    icon: '/images/dockerhub-logo.webp',
    hostname: ['hub.docker.com']
  },
  maven: {
    name: 'Maven',
    icon: '/images/apache-maven-logo.svg',
    hostname: ['mvnrepository.com']
  },
  npm: {
    name: 'NPM',
    icon: '/images/npm-logo-64.png',
    hostname: ['www.npmjs.com','npmjs.com']
  },
  pypi: {
    name: 'PyPi',
    icon: '/images/pypi-logo.svg',
    hostname: ['pypi.org']
  },
  other: {
    name: 'Other',
    icon: null,
    hostname: ['other']
  }
}

export type PackageManagerTypes = keyof typeof packageManagerSettings

export type PackageManagerInfoProps = {
  name: string,
  icon: string | null,
  hostname: string[]
}

export type NewPackageManager = {
  id: string|null
  software: string,
  url: string,
  package_manager: PackageManagerTypes|null,
  position: number
}

export type UpdateManagerProps = NewPackageManager &{
  id: string,
}

export type PackageManager = NewPackageManager & {
  id: string,
  download_count: number | null,
  download_count_scraped_at: string | null,
  reverse_dependency_count: number | null,
  reverse_dependency_count_scraped_at: string | null
}

export async function getPackageManagers({software, token}: { software: string, token: string }) {
  // console.log('getPackageManagers...default MOCK')
  return mockPackageManagers
}


export async function postPackageManager({data, token}: { data: NewPackageManager, token: string }) {
  // console.log('postPackageManager...default MOCK')
  return {
    status: 200,
    message: 'OK'
  }
}


export async function patchPackageManagers({items, token}: { items: PackageManager[], token: string }) {
  // console.log('patchPackageManagers...default MOCK')
  return {
    status: 200,
    message: 'OK'
  }
}

export async function deletePackageManager({id, token}: { id: string, token: string }) {
  // console.log('deletePackageManager...default MOCK')
  return {
    status: 200,
    message: 'OK'
  }
}
