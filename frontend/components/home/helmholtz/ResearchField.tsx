// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
//
// SPDX-License-Identifier: EUPL-1.2

import React from 'react'

export default function ResearchField({background, name}:{background: string, name: string}) {

    function mouseEnter(event: React.MouseEvent<HTMLAnchorElement>) {
      if (!(event.target instanceof HTMLAnchorElement)) return
      const background = event.target.dataset.background
      event.target.parentElement!.parentElement!.style.backgroundImage = 'url("' + background + '")'
    }

    const uriComponent = `["${name}"]`
    const link=`/software?&keywords=${encodeURIComponent(uriComponent)}&page=0&rows=12`

    return (
      <a className='underline hover:text-white' onMouseEnter={mouseEnter} data-background={background} href={link}>
        {name}
      </a>
    )
  }
