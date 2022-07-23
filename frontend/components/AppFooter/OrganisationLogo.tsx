// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {RsdHost} from '~/config/rsdSettingsReducer'
import LogoAvatar from '../layout/LogoAvatar'


export default function OrganisationLogo({host}: { host: RsdHost }) {
  if (host?.logo_url) {
    const {name,logo_url}=host
    return (
      <div className="flex items-center">
        <a href={logo_url} target="_blank"
          title={name}
          className="h-[4rem] w-[16rem]" rel="noreferrer">
          <LogoAvatar
            name={name}
            src={logo_url}
          />
        </a>
      </div>
    )
  }
  return null
}
