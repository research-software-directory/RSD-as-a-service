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

import {getHomepageCounts} from '~/components/home/getHomepageCounts'
import HelmholtzHome from '~/components/home/helmholtz'
import RsdHome,{RsdHomeProps} from '~/components/home/rsd'
import useRsdSettings from '~/config/useRsdSettings'

type HomeProps = {
  counts: RsdHomeProps
}

export default function Home({counts}: HomeProps) {
  const {host} = useRsdSettings()
  // console.log('host...', host)
  if (host && host.name.toLowerCase() === 'helmholtz') {
    return <HelmholtzHome />
  }
  return <RsdHome {...counts} />
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps() {
  // get counts for default rsd home page
  const counts = await getHomepageCounts()
  // get host information for home page
  const host = process.env.RSD_HOST ?? 'rsd'
  // provide props to home component
  return {
    props: {
      counts
    },
  }
}
