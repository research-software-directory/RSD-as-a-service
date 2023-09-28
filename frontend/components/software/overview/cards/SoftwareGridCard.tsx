// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import SoftwareCardContent from './SoftwareCardContent'
import SoftwareCardNoImage from './SoftwareCardNoImage'

type SoftwareCardProps = {
  slug:string
  brand_name: string
  short_statement: string
  image_id: string | null
  keywords: string[],
  prog_lang: string[],
  contributor_cnt: number | null
  mention_cnt: number | null
  downloads?: number,
  withImg?:boolean
}

export default function SoftwareGridCard(item:SoftwareCardProps){

  return (
    <Link
      data-testid="software-grid-card"
      href={`/software/${item.slug}`}
      className="flex-1 flex flex-col hover:text-inherit"
    >
      {item.withImg ?
        <SoftwareCardContent
          visibleKeywords={3}
          visibleProgLang={3}
          {...item}
        />
        :
        <SoftwareCardNoImage
          visibleKeywords={3}
          visibleProgLang={3}
          {...item}
        />
      }
    </Link>
  )
}
