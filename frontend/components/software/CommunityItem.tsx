// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import LogoAvatar from '~/components/layout/LogoAvatar'

export type CommunityItemProps = Readonly<{
  slug: string
  name: string
  logo_url: string | null
}>

export default function CommunityItem({slug, name, logo_url}: CommunityItemProps) {

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
            // we need to fit this one properly
            objectFit: 'scale-down'
          }
        }}
      />
    )
  }

  if (slug) {
    // internal RSD link to community
    return (
      <Link href={`/communities/${slug}/software`}
        title={name}
        className="flex flex-col items-center" rel="noreferrer"
        passHref
      >
        {renderLogo()}
      </Link>
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
