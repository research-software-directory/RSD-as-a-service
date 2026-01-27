// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import WidgetsIcon from '@mui/icons-material/Widgets'
import {PackageManager} from './edit/package-managers/apiPackageManager'
import PackageMangerIcon from './edit/package-managers/PackageManagerIcon'

type AboutPackageManagersProps={
  packages: PackageManager[]
}

function PackageManagerItem({item}:{item:PackageManager}){
  // get package manager only when url provided
  if (item.url){
    // const info = packageManagerSettings[item.package_manager ?? 'other']
    // const link = new URL(item.url)
    return (
      <a
        title={item.url}
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="hover:text-base-content"
      >
        <PackageMangerIcon platform={item.package_manager ?? 'other'}/>
      </a>
    )
  }
  return null
}

export default function AboutPackageManagers({packages}:AboutPackageManagersProps) {
  if (packages?.length > 0){
    return (
      <div>
        <div className="pb-2">
          <span className="font-bold text-primary">
            <WidgetsIcon />
          </span>
          <span className="text-primary pl-2">Packages</span>
        </div>
        <div className="flex gap-4 flex-wrap py-2">
          {packages.map(item=><PackageManagerItem key={item.id} item={item} />)}
        </div>
      </div>
    )
  }
  // do not show section if no package managers
  return null
}
