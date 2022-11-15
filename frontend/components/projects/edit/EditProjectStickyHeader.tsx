// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useRef} from 'react'
import {useController, useFormContext} from 'react-hook-form'

import StickyHeader from '../../layout/StickyHeader'
import useStickyHeaderBorder from '~/components/layout/useStickyHeaderBorder'
import useProjectContext from './useProjectContext'
import ViewPageButton from '~/components/layout/ViewPageButton'

export default function EditProjectStickyHeader() {
  const {project} = useProjectContext()
  const {control} = useFormContext()
  const {field:{value:slug},fieldState:{error:slugError}} = useController({
    name: 'slug',
    control
  })
  const headerRef = useRef(null)
  const [classes, setClasses] = useState('')
  // add border when header is at the top of the page
  const {el} = useStickyHeaderBorder({
    headerRef, setClasses
  })

  return (
    <StickyHeader className={`flex items-start xl:items-center gap-4 py-4 w-full bg-white ${classes}`}>
      <h1
        ref={headerRef}
        className="flex-1 xl:text-4xl">
        {project?.title || ''}
      </h1>
      <ViewPageButton
        title={`View ${project?.title ?? 'project page'}`}
        url={`/projects/${slug}`}
        disabled={typeof slugError !=='undefined'}
      />
    </StickyHeader>
  )
}
