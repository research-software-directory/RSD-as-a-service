// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {
  createJsonHeaders, extractErrorMessages,
  extractReturnMessage, getBaseUrl
} from '~/utils/fetchHelpers'

export type PackageManagerSettings={
  name: string,
  icon: string|null,
  hostname: string[],
  services: string[]
}

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

export async function getPackageManagers({software, token}: { software: string, token?: string }) {
  try {
    const query = `software=eq.${software}&order=position.asc,package_manager.asc`
    const url = `${getBaseUrl()}/package_manager?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      },
    })

    if (resp.status === 200) {
      const json:PackageManager[] = await resp.json()
      return json
    }
    logger(`getPackageManagers...${resp.status} ${resp.statusText}`,'warn')
    return []
  } catch (e: any) {
    logger(`getPackageManagers failed. ${e.message}`,'error')
    return []
  }
}

export async function postPackageManager({data, token}: { data: NewPackageManager, token: string }) {
  try {
    let url = `${getBaseUrl()}/package_manager`

    if (data.id) {
      const query=`id=eq.${data.id}`
      url = `${getBaseUrl()}/package_manager?${query}`
    }

    // make request
    const resp = await fetch(url,{
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // UPSERT=merging also works with POST method
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`postPackageManager failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function patchPackageManagers({items, token}: { items: PackageManager[], token: string }) {
  try {
    // create all requests
    const requests = items.map(item => {
      return patchPackageManagerItem({
        id: item.id,
        key: 'position',
        value: item.position,
        token
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    const errors = extractErrorMessages(responses)
    if (errors.length > 0) {
      return errors[0]
    }
    // if no errors it's OK
    return {
      status: 200,
      message: 'OK'
    }
  } catch (e: any) {
    logger(`patchPackageManagers failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

async function patchPackageManagerItem({id,key,value,token}:
  { id:string,key:string,value:any,token:string }) {
  try {
    const url = `/api/v1/package_manager?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      // just update position!
      body: JSON.stringify({
        [key]:value
      })
    })
    // extract errors
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchPackageManagerData failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function deletePackageManager({id,token}:{id: string,token:string}) {
  try {
    const url = `/api/v1/package_manager?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    // extract errors
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchPackageManagerData failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function getPackageManagerTypeFromUrl(url:string) {
  try {
    const urlObject = new URL(url)
    const keys = Object.keys(packageManagerSettings) as PackageManagerTypes[]

    // find first key to match the hostname
    const pm_key = keys.find(key => {
      const manager:PackageManagerSettings = packageManagerSettings[key]
      // match hostname
      return manager.hostname.includes(urlObject.hostname)
    })
    if (pm_key) {
      return pm_key
    }

    // If type not found in the pre-defined list
    // try to infer from the platforms already in the RSD
    // This is needed for Gitlab and other on premisses solutions
    const resp = await fetch(
      `${getBaseUrl()}/rpc/suggest_platform`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({hostname: urlObject.host})
      }
    )
    if (resp.status === 200) {
      const platform_type:PackageManagerTypes = await resp.json()
      if (platform_type !== null) {
        return platform_type
      }
      return 'other' as PackageManagerTypes
    }
    return 'other' as PackageManagerTypes
  } catch (e: any) {
    return 'other' as PackageManagerTypes
  }
}
