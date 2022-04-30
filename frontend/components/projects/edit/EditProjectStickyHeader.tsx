import {useContext, useEffect, useState, useRef} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'

import {useFormContext} from 'react-hook-form'

import StickyHeader from '../../layout/StickyHeader'
import useStickyHeaderBorder from '~/components/layout/useStickyHeaderBorder'
import useProjectContext from './useProjectContext'

export default function EditProjectStickyHeader() {
  const {project, step} = useProjectContext()
  const router = useRouter()
  const {formState:{isValid,isDirty,errors}} = useFormContext()
  // const {isDirty, isValid} = pageState
  const headerRef = useRef(null)
  const [classes, setClasses] = useState('')
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

  // console.group('EditProjectStickyHeader')
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('errors...', errors)
  // console.groupEnd()

  return (
    <StickyHeader className={`md:flex py-4 w-full bg-white ${classes}`}>
      <h1
        ref={headerRef}
        className="flex-1 text-primary">
        {project?.title || ''}
      </h1>
      <div className="md:pl-8">
        <Button
          tabIndex={1}
          type="button"
          color="secondary"
          onClick={() => {
            const slug = router.query['slug']
            router.push(`/projects/${slug}`)
          }}
          sx={{
            marginRight:'2rem'
          }}
        >
          VIEW
        </Button>
        {step?.formId ?
          <Button
            tabIndex={0}
            type="submit"
            variant="contained"
            form={step?.formId}
            sx={{
              // overwrite tailwind preflight.css for submit type
              '&[type="submit"]:not(.Mui-disabled)': {
                backgroundColor:'primary.main'
              }
            }}
            endIcon={
              <SaveIcon />
            }
            disabled={isSaveDisabled()}
          >
            Save
          </Button>
        : null
        }
      </div>
    </StickyHeader>
  )
}
