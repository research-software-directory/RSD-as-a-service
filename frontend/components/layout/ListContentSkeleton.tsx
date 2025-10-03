// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import CardSkeleton from '../cards/CardSkeleton'
import BaseSurfaceRounded from './BaseSurfaceRounded'

type ContentSkeletonProps=Readonly<{
  lines:number
}>

export default function ListContentSkeleton({lines}:ContentSkeletonProps){
  return (
    <BaseSurfaceRounded
      className="flex-1 flex flex-col mb-12 p-4"
      type="section"
    >
      <CardSkeleton layout={'list'} count={lines} fullWidth={true}/>
    </BaseSurfaceRounded>
  )
}
