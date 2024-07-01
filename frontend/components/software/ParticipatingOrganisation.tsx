// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {ParticipatingOrganisationProps} from '../../types/Organisation'
import LogoAvatar from '~/components/layout/LogoAvatar'

export default function ParticipatingOrganisation({rsd_path, name, website, logo_url}: ParticipatingOrganisationProps) {

  function renderLogo() {
    return (
      <LogoAvatar
        name={name}
        src={logo_url ?? undefined}
        sx={{
          '& img': {
            // height: 'auto',
            maxHeight: '100%',
            // width: 'auto',
            maxWidth: '100%',
            // we need to fit thisone properly
            objectFit: 'scale-down'
          }
        }}
      />
    )
  }

  let url: string=''
  if (rsd_path) {
    // internal RSD link to organisation
    url = `/organisations/${rsd_path}`
    return (
      <Link href={url}
        title={name}
        className="flex flex-col items-center" rel="noreferrer"
        passHref>
        {renderLogo()}
        {/* show name only for research units */}
        {rsd_path.includes('/',2)===true ? name : null}
      </Link>
    )
  }

  if (website) {
    // organisation website
    url = website
    return (
      <a href={url}
        target="_blank"
        title={name}
        className="flex items-center" rel="noreferrer">
        {renderLogo()}
      </a>
    )
  }

  // should never happen
  return (
    <div
      title={name}
      className="flex">
      {renderLogo()}
    </div>
  )
}
