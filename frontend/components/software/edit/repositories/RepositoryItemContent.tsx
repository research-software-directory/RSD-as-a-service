// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'

import {RepositoryUrl} from '~/components/software/edit/repositories/apiRepositories'
import RepositoryIcon from '~/components/software/edit/repositories/RepositoryIcon'
import {RepoPlatform, repoServiceList, repositorySettings, RepositorySettings} from './config'

type RepositoryItemContentProps=Readonly<{
  item: RepositoryUrl
}>


function RepositoryInfo({item}:RepositoryItemContentProps){
  const settings = repositorySettings[item.code_platform as RepoPlatform] as RepositorySettings
  const html=[]
  let failedSvc = 0
  // if disabled we show that
  if (item.scraping_disabled_reason){
    html.push(
      <span key="repo-disable-reason" className="text-warning">Disabled: {item.scraping_disabled_reason}<br/></span>
    )
  } else if (item.archived){
    html.push(
      //  if archived we return that info
      <span key="repo-archived-reason" className="text-warning uppercase text-sm">ARCHIVED<br/></span>
    )
  }
  // count failing services
  settings.services.forEach(svc=>{
    if (repoServiceList.hasOwnProperty(svc)===true){
      const repoSvc = repoServiceList[svc]
      if (repoSvc.props?.last_error && item?.[repoSvc.props?.last_error as keyof RepositoryUrl]){
        failedSvc+=1
      }
    }
  })

  html.push(
    <span key="repo-service-count">RSD background services: {settings.services.length}, Failed: {failedSvc}</span>
  )
  return html
}


export default function RepositoryItemContent({item}:RepositoryItemContentProps) {
  return (
    <>
      <ListItemAvatar>
        <RepositoryIcon platform={item.code_platform} />
      </ListItemAvatar>
      <ListItemText
        primary={item.url}
        secondary={
          <RepositoryInfo item={item} />
        }
      />
    </>
  )
}
