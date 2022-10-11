// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import SoftwareCard from './SoftwareCard'
import NoContent from '~/components/layout/NoContent'

export type SoftwareGridType = {
  slug: string
  brand_name: string
  short_statement?: string
  is_featured?: boolean
  updated_at?: string | null
  is_published?: boolean
  mention_cnt?: number | null
  contributor_cnt?: number | null
}

// render software cards
export default function SoftwareGrid({software,className}: { software: SoftwareGridType[], className?:string }) {
  // console.log("renderItems...software...", software)

  if (software.length === 0) {
    return <NoContent message="No results"/>
  }

  return (
    <div className={'grid gap-[3px] grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'+ className}>
      {software.map(item => {
        return (
          <SoftwareCard
            key={`/software/${item.slug}/`}
            href={`/software/${item.slug}/`}
            brand_name={item.brand_name}
            short_statement={item.short_statement ?? ''}
            is_featured={item?.is_featured ?? false}
            is_published={item?.is_published}
            updated_at={item.updated_at ?? null}
            mention_cnt={item?.mention_cnt ?? null}
            contributor_cnt={item?.contributor_cnt ?? null}
          />
        )
      })}
    </div>
  )
}
