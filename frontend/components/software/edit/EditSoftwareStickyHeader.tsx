// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useRef} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'

import StickyHeader from '../../layout/StickyHeader'
import useStickyHeaderBorder from '~/components/layout/useStickyHeaderBorder'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {useFormContext} from 'react-hook-form'
import useSoftwareContext from './useSoftwareContext'

export default function StickyHeaderEditSoftware() {
  const {software,step} = useSoftwareContext()
  const {formState:{isValid,isDirty}} = useFormContext()
  const headerRef = useRef(null)
  const [classes, setClasses] = useState('')
  const router = useRouter()
  // add border when header is at the top of the page
  const {el} = useStickyHeaderBorder({
    headerRef, setClasses
  })

  function isSaveDisabled() {
    if (isDirty === false || isValid === false) {
      return true
    }
    return false
  }

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
            const slug = router.query['slug']
            router.push(`/software/${slug}`)
          }}
          sx={{
            marginRight:'2rem'
          }}
        >
          VIEW
        </Button>
        {step?.formId ?
          <SubmitButtonWithListener
            formId={step?.formId}
            disabled={isSaveDisabled()}
          />
        : null
        }
      </div>
    </StickyHeader>
  )
}
