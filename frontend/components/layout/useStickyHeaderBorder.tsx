// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RefObject, useEffect} from 'react'

type StickyHeaderBorderProps = {
  headerRef: RefObject<any>
  setClasses: (classes:string)=>void
}

export default function useStickyHeaderBorder({headerRef,setClasses}:StickyHeaderBorderProps) {
  useEffect(() => {
    /**
     * Observe when header (h1 element) moves in/outside a certain area.
     * It is used to add the border at the bottom of sticky header (border-b-2 class).
     * The logic is:
     * 1. we ignore first 68px at the top of the screen.
     * 2. when header reaches this area the observer will set isIntersecting flag to false
     * 3. when isIntersecting===false, the header is at first 68px of the screen and we add border
     * More info: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
     */
    const observer = new IntersectionObserver((e) => {
      const h1 = e[0]
      if (h1.isIntersecting===true) {
        setClasses('')
      } else {
        setClasses('border-b-2')
      }
    }, {
      //
      rootMargin:'-68px'
    })
    const el = headerRef.current
    if (el) {
      observer.observe(el)
    }
    return () => {
      // remove observer
      if (observer && el) {
        observer.unobserve(el)
      }
    }
  }, [headerRef, setClasses])

  return {
    // eslint-disable-next-line react-hooks/refs
    el: headerRef?.current ?? undefined
  }
}
