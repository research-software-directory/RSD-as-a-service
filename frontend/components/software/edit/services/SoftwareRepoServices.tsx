// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import List from '@mui/material/List'
import ContentLoader from '~/components/layout/ContentLoader'

import {CodePlatform} from '../repositories/apiRepositories'
import {repoServiceList} from './config'
import {ServiceInfoListItem} from './ServiceInfoListItem'
import useSoftwareServices from './useSoftwareServices'

export default function SoftwareRepoServices() {
  const {loading,service,loadServices} = useSoftwareServices()

  if (loading) return <ContentLoader />

  return (
    <>
      {service?.scraping_disabled_reason
        ? <span style={{color: 'red'}}>The harvesters for this repo were disabled by the admins for the following reason: {service?.scraping_disabled_reason}</span>
        : null}
      <List>
        {repoServiceList.map(svc=>{
          const props = {
            id: service?.id,
            title: svc.name,
            desc: svc.desc,
            scraped_at: service?.[svc.props.scraped_at] as string ?? null,
            last_error: service?.[svc.props.last_error] as string ?? null,
            url: service?.[svc.props.url] as string ?? null,
            platform: service?.['code_platform'] as CodePlatform ?? null,
            dbprops: svc.dbprops
          }
          return (
            <ServiceInfoListItem
              key={svc.name}
              scraping_disabled_reason={service?.scraping_disabled_reason}
              onClear={()=>loadServices(false)}
              {...props}
            />
          )
        })}
      </List>
    </>
  )
}
