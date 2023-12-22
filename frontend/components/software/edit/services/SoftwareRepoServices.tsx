// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import {useSoftwareServices} from './apiSoftwareServices'
import ContentLoader from '~/components/layout/ContentLoader'

import {repoServiceList} from './config'
import {ServiceInfoListItem} from './ServiceInfoListItem'


export default function SoftwareRepoServices() {
  const {loading,services} = useSoftwareServices()

  if (loading) return <ContentLoader />

  return (
    <List>
      {repoServiceList.map(service=>{
        const props = {
          title: service.name,
          desc: service.desc,
          scraped_at: services ? services[service.props.scraped_at] : null,
          last_error: services ? services[service.props.last_error] : null,
          url: services ? services[service.props.url] : null
        }
        return (
          <ServiceInfoListItem key={service.name} {...props} />
        )
      })}
    </List>
  )

}
