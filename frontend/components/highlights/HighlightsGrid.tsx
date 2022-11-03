// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {SoftwareListItem} from '~/types/SoftwareTypes'
import FlexibleGridSection, {FlexGridProps} from '../layout/FlexibleGridSection'
import HighlightsCard from './HighlightsCard'

export default function HighlightsGrid(
    {software, grid, className='gap-[0.125rem] pt-4 pb-12'}:
    {software: SoftwareListItem[], grid: FlexGridProps, className?:string}
  ) {

  return (
    <FlexibleGridSection
      className={className}
      {...grid}
    >
      {software.map(item => {
        return (
          <HighlightsCard
            id={item.id}
            key={item.slug}
            slug={item.slug}
            brand_name={item.brand_name}
            image_id={item.image_id}
            short_statement={item.short_statement ?? ''}
            is_featured={item?.is_featured ?? false}
            is_published={item?.is_published}
            updated_at={item?.updated_at ?? null}
            mention_cnt={item?.mention_cnt ?? null}
            contributor_cnt={item?.contributor_cnt ?? null}
          />
        )
      })}
    </FlexibleGridSection>
  )
}
