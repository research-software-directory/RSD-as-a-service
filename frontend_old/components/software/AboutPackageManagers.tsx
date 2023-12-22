// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {PackageManager, packageManagerSettings} from './edit/package-managers/apiPackageManager'
import WidgetsIcon from '@mui/icons-material/Widgets'

type AboutPackageManagersProps={
  packages: PackageManager[]
}

function PackageManager({item}:{item:PackageManager}){
  // get package manager info
  const info = packageManagerSettings[item.package_manager ?? 'other']
  return (
    <div
      title={info.name}
      className="flex items-center p-1 h-[4rem] w-[4rem] hover:bg-base-200"
    >
      <a href={item.url} target="_blank">
        <img src={info.icon ?? ''} alt={`Logo ${info.name}`} />
      </a>
    </div>
  )
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
          {packages.map(item=><PackageManager key={item.id} item={item} />)}
        </div>
      </>
    )
  }
  // do not show section if no package managers
  return null
}
