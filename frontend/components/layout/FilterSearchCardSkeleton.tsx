// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Skeleton from '@mui/material/Skeleton'

import FiltersPanel from '~/components/filter/FiltersPanel'
import CardSkeleton, {CardSkeletonProps} from '~/components/cards/CardSkeleton'

export default function FilterSearchCardSkeleton({count=3,layout='grid',fullWidth=false}:CardSkeletonProps) {

  // console.group('FilterSearchCardSkeleton')
  // console.log('count...', count)
  // console.log('layout...', layout)
  // console.log('fullWidth...', fullWidth)
  // console.groupEnd()

  /* Grid with 2 sections: left filter panel and main content */
  return (
    <div className="flex-1 grid md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_4fr] gap-4 mb-12">
      {/* Filters skeleton */}
      <FiltersPanel>
        <Skeleton
          variant="rectangular"
          width={'100%'}
          height={'100%'}
          sx={{
            borderRadius:'0.25rem'
          }}
        />
      </FiltersPanel>
      {/* Search & main content skeleton */}
      <div className="flex-1">
        <section data-testid="search-section">
          <div className="flex border rounded-md shadow-xs bg-base-100 p-2">
            <Skeleton
              variant="rectangular"
              width={'100%'}
              height={'2.5rem'}
              sx={{
                borderRadius:'0.25rem'
              }}
            />
          </div>
        </section>
        {/* software overview/content skeleton */}
        <CardSkeleton layout={layout} count={count} fullWidth={fullWidth}/>
      </div>
    </div>
  )
}
