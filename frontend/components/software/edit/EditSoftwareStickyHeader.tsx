// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useRef} from 'react'
import {useController, useFormContext} from 'react-hook-form'

import StickyHeader from '../../layout/StickyHeader'
import useStickyHeaderBorder from '~/components/layout/useStickyHeaderBorder'
import useSoftwareContext from './useSoftwareContext'
import ViewPageButton from '~/components/layout/ViewPageButton'

export default function EditSoftwareStickyHeader() {
  const {software} = useSoftwareContext()
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
        {software?.brand_name || ''}
      </h1>
      <ViewPageButton
        title={`View ${software?.brand_name ?? 'software page'}`}
        url={`/software/${slug}`}
        disabled={typeof slugError !=='undefined'}
      />
    </StickyHeader>
  )
}
