// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: EUPL-1.2

import {GetServerSidePropsContext} from 'next'
import {getHomepageCounts} from '~/components/home/getHomepageCounts'
import HelmholtzHome from '~/components/home/helmholtz'
import RsdHome,{RsdHomeProps} from '~/components/home/rsd'
import useRsdSettings from '~/config/useRsdSettings'
import logger from '~/utils/logger'
import {createJsonHeaders} from '~/utils/fetchHelpers'

type HomeProps = {
  counts: RsdHomeProps,
  organisations: any[],
}

async function getOrganisationsList({url, token}: {url: string, token?: string}) {
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      },
    })

    if ([200, 206].includes(resp.status)) {
      const organisationList: Array<JSON> = await resp.json()

      const shuffled_data = []
      while (organisationList.length > 0) {
        let rnd = Math.floor(Math.random() * (organisationList.length))
        shuffled_data.push(organisationList.splice(rnd, 1)[0])
      }

      return {
        data: shuffled_data
      }
    }
    // otherwise request failed
    logger(`getOrganisationsList failed: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      data: []
    }
  } catch (e: any) {
    logger(`getOrganisationsList: ${e?.message}`, 'error')
    return {
      data: []
    }
  }
}

export default function Home({counts, organisations}: HomeProps) {
  const {host} = useRsdSettings()
  // console.log('host...', host)
  if (host && host.name.toLowerCase() === 'helmholtz') {
    return <HelmholtzHome organisations={organisations}/>
  }
  return <RsdHome {...counts} />
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {req} = context
  const token = req?.cookies['rsd_token']
  const url = `${process.env.POSTGREST_URL}/rpc/organisations_overview?parent=is.null&software_cnt=gt.0`
  const {data} = await getOrganisationsList({url, token})

  // get counts for default rsd home page
  const counts = await getHomepageCounts()
  // get host information for home page
  const host = process.env.RSD_HOST ?? 'rsd'

  // provide props to home component
  return {
    props: {
      counts,
      organisations: data,
    },
  }
}
