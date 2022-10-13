// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useRef} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'

import StickyHeader from '../../layout/StickyHeader'
import useStickyHeaderBorder from '~/components/layout/useStickyHeaderBorder'
import {useController, useFormContext} from 'react-hook-form'
import useSoftwareContext from './useSoftwareContext'

export default function EditSoftwareStickyHeader() {
  const {software} = useSoftwareContext()
  const {control} = useFormContext()
  const {field:{value:slug},fieldState:{error:slugError}} = useController({
    name: 'slug',
    control
  })
  const headerRef = useRef(null)
  const [classes, setClasses] = useState('')
  const router = useRouter()
  // add border when header is at the top of the page
  const {el} = useStickyHeaderBorder({
    headerRef, setClasses
  })

  // if (isDirty) {
  //   console.group('EditProjectStickyHeader')
  //   console.log('isDirty...', isDirty)
  //   console.log('isValid...', isValid)
  //   console.log('dirtyFields...', dirtyFields)
  //   console.groupEnd()
  // }

  return (
    <StickyHeader className={`flex py-4 w-full bg-white ${classes}`}>
      <h1
        ref={headerRef}
        className="flex-1 text-primary">
        {software?.brand_name || ''}
      </h1>
      <div>
        <Button
          tabIndex={1}
          type="button"
          color="secondary"
          onClick={() => {
            // const slug = router.query['slug']
            router.push(`/software/${slug}`)
            // complete page reload?
            // location.href=`/projects/${slug}`
          }}
          sx={{
            marginRight:'0.5rem'
          }}
          disabled={typeof slugError !=='undefined'}
        >
          VIEW PAGE
        </Button>
      </div>
    </StickyHeader>
  )
}
