// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Skeleton from '@mui/material/Skeleton'
import BaseSurfaceRounded from './BaseSurfaceRounded'
import JavaScriptRequiredMsg from './JavaScriptRequiredMsg'

export function TextSkeleton({lines=5,fontSize='2rem'}:Readonly<{lines?:number, fontSize?:string}>){
  const items = []
  for (let i = 0; i < lines; i++){
    items.push(<Skeleton key={`skelton-line-${i}`} variant="text" sx={{fontSize}} />)
  }
  return (
    <div className="noscript:hidden">
      {items}
    </div>
  )
}

type NavContentSkeletonProps=Readonly<{
  gridCols?: '1fr_1fr'|'1fr_2fr'|'1fr_3fr'|'1fr_4fr'
  contentLines?: number
}>

export default function NavContentSkeleton({gridCols='1fr_4fr',contentLines=5}:NavContentSkeletonProps) {
  return (
    <div className={`flex-1 grid grid-cols-[${gridCols}] gap-4`}>
      <BaseSurfaceRounded
        className="mb-12 p-4"
      >
        <Skeleton
          variant="rectangular"
          width={'100%'}
          height={'100%'}
          sx={{
            borderRadius:'0.25rem'
          }}
        />
      </BaseSurfaceRounded>
      <BaseSurfaceRounded
        className="flex-1 flex flex-col mb-12 p-4"
        type="section"
      >
        {/* show loading skeleton only when JS enabled */}
        <TextSkeleton lines={contentLines} fontSize='3rem' />
        {/* show JS requited message only when JS disabled */}
        <JavaScriptRequiredMsg />
      </BaseSurfaceRounded>
    </div>
  )
}
