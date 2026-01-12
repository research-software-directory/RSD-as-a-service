// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import {BackgroundServiceListItem} from '../repositories/BackgroundServiceListItem'
import {PackageManagerServiceKey, PackageManagerSettings, pacManServiceList, PacManSvcProps} from './config'
import {PackageManager} from './apiPackageManager'

type PacManSvcReportProps=Readonly<{
  item: PackageManager,
  settings: PackageManagerSettings
  onClear: ({id,data}:{id:string,data:Partial<PackageManager>})=>void
}>

export default function PacManSvcReport({item,settings,onClear}:PacManSvcReportProps) {
  if (settings.services.length===0){
    return (
      <div className="flex gap-4 items-center pt-8 text-base-content-secondary">
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
        const svc = pacManServiceList[service as PackageManagerServiceKey] as PacManSvcProps
        return (
          <BackgroundServiceListItem
            key={svc.name}
            id={item.id}
            title={svc.name}
            scraped_at={item?.[svc.props.scraped_at] as string ?? null}
            last_error={item?.[svc.props.last_error] as string ?? null}
            url={item?.[svc.props.url] as string ?? null}
            platform={item.package_manager ?? 'other'}
            scraping_disabled_reason={item?.[svc.props.disable_reason] as string ?? null}
            dbprops={svc.dbprops}
            onClear={()=>{
              if (svc?.dbprops && item.id){
                // create object with props to be set to null
                const data = svc?.dbprops.reduce((acc, dbprop) => ({...acc, [dbprop]: null}), {})
                onClear({
                  id: item.id,
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
