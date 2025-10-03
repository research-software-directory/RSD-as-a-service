// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState, useRef} from 'react'

import StickyHeader from '../../layout/StickyHeader'
import useStickyHeaderBorder from '~/components/layout/useStickyHeaderBorder'
import useSoftwareContext from './context/useSoftwareContext'
import ViewPageButton from '~/components/layout/ViewPageButton'

export default function EditSoftwareStickyHeader() {
  const {software} = useSoftwareContext()
  const headerRef = useRef(null)
  const [classes, setClasses] = useState('')

  // add border when header is at the top of the page
  useStickyHeaderBorder({
    headerRef, setClasses
  })

  return (
    <StickyHeader className={`bg-base-100 ${classes}`}>
      <h1
        ref={headerRef}
        className="flex-1 xl:text-4xl">
        {software?.brand_name || ''}
      </h1>
      <ViewPageButton
        title={`View ${software?.brand_name ?? 'software page'}`}
        url={`/software/${software.slug}`}
        disabled={typeof software === 'undefined'}
        label="View software"
      />
    </StickyHeader>
  )
}
