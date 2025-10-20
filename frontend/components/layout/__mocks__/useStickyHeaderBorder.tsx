// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RefObject} from 'react'

type StickyHeaderBorderProps = {
  headerRef: RefObject<any>
  setClasses: (classes:string)=>void
}

// MOCKED useStickyHeaderBorder hook
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStickyHeaderBorder=jest.fn(async({headerRef,setClasses}:StickyHeaderBorderProps)=>{
  return {
    el: headerRef?.current ?? undefined
  }
})

export default useStickyHeaderBorder
