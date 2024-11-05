// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {MutableRefObject} from 'react'

type StickyHeaderBorderProps = {
  headerRef: MutableRefObject<any>
  setClasses: (classes:string)=>void
}

// MOCKED useStickyHeaderBorder hook
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useStickyHeaderBorder({headerRef,setClasses}:StickyHeaderBorderProps) {
  return {
    el: headerRef?.current ?? undefined
  }
}
