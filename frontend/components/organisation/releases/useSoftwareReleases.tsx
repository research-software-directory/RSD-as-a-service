// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

type SoftwareReleaseBase = {
  software_id: string
  software_slug: string
  software_name: string
  release_doi: string
  release_tag: string
  release_date: string
  release_year: number
  organisation_slug: string[]
}


type SoftwareReleaseApi = SoftwareReleaseBase & {
  // source: release_content.schema_dot_org
  // json object stored as string
  release_info: string
}

export type SoftwareReleaseInfo = SoftwareReleaseBase & {
  // we extract all persons from release_info object
  person: string[]
}

export type SoftwareReleasedByYear = {
  [key: string]: SoftwareReleaseInfo[]
}

type ReleasePerson = {
  // "https://orcid.org/0000-0002-5821-2060"
  '@id': string
  '@type': 'Person',
  'affiliation': {
    '@type': 'Organization',
    'legalName': string
  },
  'familyName': string
  'givenName': string
}

type ReleaseInfo={
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  author: ReleasePerson[],
  contributor?: ReleasePerson[]
  // "https://github.com/3D-e-Chem/knime-silicos-it"
  'codeRepository': string,
  // "2019-06-27",
  'datePublished': string
  // "https://doi.org/10.5281/zenodo.3258131",
  'identifier': string
  // "http://www.apache.org/licenses/LICENSE-2.0",
  'license': string
  // "KNIME nodes and example workflows for software made by Silicos-it, ie. align-it, shape-it",
  'name': string
  // "v1.1.3"
  'version': string
}


type UseSoftwareReleaseProps = {
  organisation_slug: string,
  token: string
}


function displayNameFromPerson(person: ReleasePerson) {
  try {
    return `${person?.givenName} ${person?.familyName}`
  } catch (e) {
    return ''
  }
}

function extractPersonsFromReleaseInfo(info: string) {
  try {
    if (info === null) return []

    const persons: string[] = []
    const releaseInfo: ReleaseInfo = JSON.parse(info)

    if (releaseInfo.hasOwnProperty('author') === true) {
      releaseInfo.author.forEach(item => {
        const name = displayNameFromPerson(item)
        // push only names with some content
        if (name!=='') persons.push(name)
      })
    }

    if (releaseInfo.hasOwnProperty('contributor') === true) {
      releaseInfo.author.forEach(item => {
        const name = displayNameFromPerson(item)
        // push only names with some content
        if (name!=='') persons.push(name)
      })
    }

    return persons
  } catch (e:any) {
    logger(`extractPersonsFromReleaseInfo...error: ${e.message}`)
    return []
  }
}


function softwareReleaseByYear(data: SoftwareReleaseApi[]) {
  const releaseByYear:SoftwareReleasedByYear = {}

  data.forEach(item => {
    if (releaseByYear.hasOwnProperty(item.release_year.toString())===false) {
      // create new key
      releaseByYear[item.release_year.toString()] = []
    }
    // parse info
    // item.release_info = JSON.parse(item.release_info)
    releaseByYear[item.release_year.toString()].push({
      ...item,
      person: extractPersonsFromReleaseInfo(item.release_info)
    })
  })

  return releaseByYear
}

async function getReleasesForOrganisation({organisation_slug, token}:UseSoftwareReleaseProps) {
  try {
    const query = `organisation_slug=cs.{${organisation_slug}}&order=release_date.desc`
    const url = `${getBaseUrl()}/rpc/software_release?${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })

    if (resp.status === 200) {
      const data:SoftwareReleaseApi[] = await resp.json()
      return softwareReleaseByYear(data)
    }
    // some other errors
    logger(`getReleasesForOrganisation...${resp.status} ${resp.statusText}`)
    return null
  } catch(e:any) {
    logger(`getReleasesForOrganisation...error...${e.message}`)
    return null
  }
}

export default function useSoftwareRelease({organisation_slug, token}:UseSoftwareReleaseProps) {
  const [loading, setLoading] = useState(true)
  const [releases, setReleases] = useState<SoftwareReleasedByYear>()


  // console.group('useSoftwareRelease')
  // console.log('loading...', loading)
  // console.log('releases...', releases)
  // console.log('organisation_slug...', organisation_slug)
  // console.log('token...', token)
  // console.groupEnd()

  useEffect(() => {
    async function getReleases() {
      setLoading(true)
      // make request
      const releases = await getReleasesForOrganisation({organisation_slug, token})
      // update releases
      if (releases) setReleases(releases)
      setLoading(false)
    }

    if (organisation_slug) {
      getReleases()
    }

  },[organisation_slug,token])

  return {
    loading,
    releases
  }
}
