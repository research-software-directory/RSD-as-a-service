// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import {usePackageManagerServices} from './apiSoftwareServices'
import ContentLoader from '~/components/layout/ContentLoader'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import {PackageManagerSettings, packageManagerSettings} from '../package-managers/apiPackageManager'
import {ServiceInfoListItem} from './ServiceInfoListItem'


export default function PackageManagerServices() {
  const {loading,services} = usePackageManagerServices()

  if (loading) return <ContentLoader />

  if (services?.length > 0){
    return (
      <div>
        {services.map(service=>{
          // For each PM show status of scrapers
          const svcInfo = packageManagerSettings[service.package_manager] as PackageManagerSettings
          if (svcInfo && svcInfo.services.length > 0){
            return (
              <List key={service.url}>
                {svcInfo?.services.includes('downloads') ?
                  <ServiceInfoListItem
                    key={`downloads-${service.url}`}
                    title={`${service.package_manager.toLocaleUpperCase()} downloads`}
                    scraped_at={service.download_count_scraped_at}
                    last_error={service.download_count_last_error}
                    url={service.url}
                    platform={null}
                    scraping_disabled_reason={service.download_count_scraping_disabled_reason}
                  />
                  : null
                }
                {svcInfo?.services.includes('dependents') ?
                  <ServiceInfoListItem
                    key={`dependants-${service.url}`}
                    title={`${service.package_manager.toLocaleUpperCase()} dependents`}
                    scraped_at={service.reverse_dependency_count_scraped_at}
                    last_error={service.reverse_dependency_count_last_error}
                    url={service.url}
                    platform={null}
                    scraping_disabled_reason={service.reverse_dependency_count_scraping_disabled_reason}
                  />
                  : null
                }
              </List>
            )
          }
        })}
      </div>
    )
  }

  return (
    <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
      <AlertTitle sx={{fontWeight:500}}>Not active</AlertTitle>
      No information about <strong>supported</strong> package managers is provided for this software.
    </Alert>
  )
}
