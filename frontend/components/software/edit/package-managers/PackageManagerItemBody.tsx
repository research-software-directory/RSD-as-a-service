// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'

import PackageMangerIcon from './PackageManagerIcon'
import {PackageManager} from './apiPackageManager'
import {
  PackageManagerServiceKey, pacManServiceList,
  PacManSvcProps, packageManagerSettings
} from './config'

type ServiceStatusProps=Readonly<{
  item: PackageManager
}>

function RsdScraperStatus({item}:ServiceStatusProps){
  // get package manager services from settings
  const services = packageManagerSettings[item.package_manager ?? 'other']?.services ?? []
  const html = []
  let failedSvc = 0
  services.forEach((svc)=>{
    // does service definition exists
    if (pacManServiceList.hasOwnProperty(svc)===true){
      const pacmanSvc = pacManServiceList[svc as PackageManagerServiceKey] as PacManSvcProps
      // disable reason prop is defined and it has value
      if (pacmanSvc.props?.disable_reason && item?.[pacmanSvc.props.disable_reason]){
        html.push(
          <span key={`${svc}-disable-reason`} style={{color:'var(--rsd-warning,#ed6c02)'}}>
            Disabled: {item[pacmanSvc.props.disable_reason]}<br/>
          </span>
        )
      }
      // count failing services
      if (pacmanSvc.props?.last_error && item?.[pacmanSvc.props?.last_error]){
        failedSvc+=1
      }
    }
  })
  html.push(<span key="service-count">RSD background services: {services.length}, Failed: {failedSvc}</span>)
  return html
}

export default function PackageManagerItemBody({item}:Readonly<{item:PackageManager}>) {

  return (
    <>
      <ListItemAvatar>
        <PackageMangerIcon platform={item.package_manager ?? 'other'}/>
      </ListItemAvatar>
      <ListItemText
        primary={item.url}
        secondary={
          <RsdScraperStatus item={item}/>
        }
      />
    </>
  )
}
