// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Skeleton from '@mui/material/Skeleton'
import SoftwareOverviewList from '~/components/software/overview/list/SoftwareOverviewList'

type GridListSkeletonProps = Readonly<{
  count: number
}>

export default function GridListSkeleton({count=3}:GridListSkeletonProps) {
  // let items = new Array(count).fill('a') as string[]
  const items = []

  for (let i = 0; i < count; i++){
    items.push(
      <Skeleton
        key={i}
        variant="rectangular"
        width={'100%'}
        height={'4rem'}
        sx={{
          borderRadius:'0.25rem'
        }}
      >

      </Skeleton>
    )
  }
  // debugger
  return (
    <SoftwareOverviewList>
      {items}
    </SoftwareOverviewList>
  )
}
