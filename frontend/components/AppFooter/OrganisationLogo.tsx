// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RsdHost} from '~/config/rsdSettingsReducer'
import LogoAvatar from '../layout/LogoAvatar'


export default function OrganisationLogo({host}: {host: RsdHost}) {

  if (host?.logo_url && host?.website) {
    const {name,logo_url,website}=host
    return (
      <div className="flex items-center">
        <a href={website} target="_blank"
          className="h-[4rem] w-[16rem]" rel="noreferrer">
          <LogoAvatar
            name={name}
            src={logo_url}
          />
        </a>
      </div>
    )
  }
  if (host?.logo_url) {
    const {name,logo_url}=host
    return (
      <div className="flex items-center">
        <span className="h-[4rem] w-[16rem]">
          <LogoAvatar
            name={name}
            src={logo_url}
          />
        </span>
      </div>
    )
  }
  return null
}
