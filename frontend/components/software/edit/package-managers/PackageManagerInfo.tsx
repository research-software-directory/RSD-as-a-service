// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Avatar from '@mui/material/Avatar'

import {packageManagerSettings, PackageManagerTypes} from './apiPackageManager'


function PlatformPlaceholder() {
  return (
    <Alert severity="info"
      sx={{
        flex:1,
        marginTop: '0.5rem'
      }}
    >
      <AlertTitle sx={{fontWeight:500}}>Detected platform</AlertTitle>
      Please provide <strong>location</strong> in the box above.
    </Alert>
  )
}

export default function PackageManagerInfo({pm_key}: { pm_key: PackageManagerTypes|null }) {

  if (typeof pm_key==='undefined' || pm_key===null) return <PlatformPlaceholder />

  const info = packageManagerSettings[pm_key as PackageManagerTypes]

  return (
    <div className="flex gap-8 items-start">
      <h3>
        Detected platform
      </h3>
      <div className="text-center">
        <Avatar
          variant="square"
          src={info.icon ?? ''}
          sx={{
            width: '3rem',
            height: '3rem',
            '& img': {
              objectFit:'contain'
            }
          }}
        >
          {info.name.slice(0,3)}
        </Avatar>
        <div className="text-base-content-disabled mt-2">{info.name}</div>
      </div>
    </div>
  )
}
