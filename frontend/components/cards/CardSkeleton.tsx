// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {LayoutType} from 'app/(overviews)/components/ViewToggleGroup'
import GridCardSkeleton from './GridCardSkeleton'
import GridListSkeleton from './GridListSkeleton'

export type CardSkeletonProps = Readonly<{
  count: number
  layout?: LayoutType
  fullWidth?: boolean
}>

export default function CardSkeleton({count=3,layout='grid',fullWidth=false}:CardSkeletonProps) {
  if (layout === 'list'){
    return (
      <GridListSkeleton count={count}/>
    )
  }
  // card is default skeleton
  return (
    <GridCardSkeleton count={count} fullWidth={fullWidth}/>
  )
}
