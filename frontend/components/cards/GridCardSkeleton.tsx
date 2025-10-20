// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Skeleton from '@mui/material/Skeleton'

import GridOverview from '~/components/layout/GridOverview'

type CardSkeletonProps = Readonly<{
  count: number
  fullWidth: boolean
}>

export default function GridCardSkeleton({count=3,fullWidth=false}:CardSkeletonProps) {
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
    <GridOverview fullWidth={fullWidth}>
      {items}
    </GridOverview>
  )
}
