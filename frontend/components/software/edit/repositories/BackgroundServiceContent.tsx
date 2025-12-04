// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'

import {RepositoryForSoftware, RepositoryUrl} from './apiRepositories'
import {BackgroundServiceListItem} from './BackgroundServiceListItem'
import {repoServiceList, RepositorySettings, ServiceListProps} from './config'

export type ClearServiceDataProps = {
  id:string,
  data:Partial<RepositoryUrl>
}

type BackgroundServiceContentProps=Readonly<{
  repository: RepositoryForSoftware
  settings: RepositorySettings
  onClear: ({id,data}:ClearServiceDataProps)=>void
}>

export default function BackgroundServiceContent({repository,settings,onClear}:BackgroundServiceContentProps) {
  if (settings.services.length===0){
    return (
      <div className="flex gap-4 items-center py-12 pl-2 text-base-content-secondary">
        <SentimentVeryDissatisfiedIcon sx={{
          width:'3.5rem', height:'3.5rem'
        }} />
        <span>No background services supported for {settings.name}</span>
      </div>
    )
  }
  return (
    <ul className="pt-2 pl-2">
      {settings.services.map((service)=>{
        const svc = repoServiceList[service] as ServiceListProps
        return (
          <BackgroundServiceListItem
            key={svc.name}
            id={repository.id}
            title={svc.name}
            scraped_at={repository?.[svc.props.scraped_at] as string ?? null}
            last_error={repository?.[svc.props.last_error] as string ?? null}
            url={repository?.[svc.props.url] as string ?? null}
            platform={repository.code_platform}
            scraping_disabled_reason={repository?.scraping_disabled_reason}
            dbprops={svc.dbprops}
            onClear={()=>{
              if (svc?.dbprops && repository.id){
                // create object with props to be set to null
                const data = svc?.dbprops.reduce((acc, dbprop) => ({...acc, [dbprop]: null}), {})
                onClear({
                  id: repository.id,
                  data
                })
              }
            }}
          />
        )
      })}
    </ul>
  )
}
