// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {MutableRefObject} from 'react'

type StickyHeaderBorderProps = {
  headerRef: MutableRefObject<any>
  setClasses: (classes:string)=>void
}

// MOCKED useStickyHeaderBorder hook
export default function useStickyHeaderBorder({headerRef,setClasses}:StickyHeaderBorderProps) {
  return {
    el: headerRef?.current ?? undefined
  }
}
