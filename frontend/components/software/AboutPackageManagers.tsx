// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import WidgetsIcon from '@mui/icons-material/Widgets'
import LogoAvatar from '~/components/layout/LogoAvatar'
import {PackageManager, packageManagerSettings} from './edit/package-managers/apiPackageManager'

type AboutPackageManagersProps={
  packages: PackageManager[]
}

function PackageManagerItem({item}:{item:PackageManager}){
  // get package manager only when url provided
  if (item.url){
    const info = packageManagerSettings[item.package_manager ?? 'other']
    const link = new URL(item.url)
    return (
      <a href={item.url} target="_blank">
        <LogoAvatar
          name={link.hostname}
          src={info.icon ?? undefined}
          sx={{
            height: '4rem',
            width: '4rem',
            fontSize: '1.5rem',
            // borderRadius: '0.25rem',
            '& img': {
              // fit icon into area
              objectFit: 'scale-down'
            }
          }}
        />
      </a>
    )
  }
  return null
}


export default function AboutPackageManagers({packages}:AboutPackageManagersProps) {
  if (packages?.length > 0){
    return (
      <>
        <div className="pt-8 pb-2">
          <span className="font-bold text-primary">
            <WidgetsIcon />
          </span>
          <span className="text-primary pl-2">Packages</span>
        </div>
        <div className="flex gap-4 flex-wrap">
          {packages.map(item=><PackageManagerItem key={item.id} item={item} />)}
        </div>
      </>
    )
  }
  // do not show section if no package managers
  return null
}
