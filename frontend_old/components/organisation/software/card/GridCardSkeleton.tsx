// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Skeleton from '@mui/material/Skeleton'
import SoftwareOverviewGrid from '~/components/software/overview/cards/SoftwareOverviewGrid'

type CardSkeletonProps = {
  count: number
}

export default function GridCardSkeleton({count=3}:CardSkeletonProps) {
  // let items = new Array(count).fill('a') as string[]
  const items = []

  for (let i = 0; i < count; i++){
    items.push(
      <Skeleton
        key={i}
        variant="rectangular"
        width={'100%'}
        height={'100%'}
        sx={{
          borderRadius:'0.5rem'
        }}
      >

      </Skeleton>
    )
  }
  // debugger
  return (
    <SoftwareOverviewGrid>
      {items}
    </SoftwareOverviewGrid>
  )
}
