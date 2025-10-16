// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState, useRef} from 'react'

import StickyHeader from '../../layout/StickyHeader'
import useStickyHeaderBorder from '~/components/layout/useStickyHeaderBorder'
import useProjectContext from './context/useProjectContext'
import ViewPageButton from '~/components/layout/ViewPageButton'

export default function EditProjectStickyHeader() {
  const {project} = useProjectContext()

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
        {project?.title || ''}
      </h1>
      <ViewPageButton
        title={`View ${project?.title ?? 'project page'}`}
        url={`/projects/${project.slug}`}
        disabled={typeof project === 'undefined'}
        label="View Project"
      />
    </StickyHeader>
  )
}
