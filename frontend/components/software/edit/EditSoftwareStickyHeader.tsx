import {useContext, useEffect, useState, useRef} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'

import StickyHeader from '../../layout/StickyHeader'
import editSoftwareContext from './editSoftwareContext'

export default function StickyHeaderEditSoftware() {
  const {pageState} = useContext(editSoftwareContext)
  const {isDirty, isValid} = pageState
  const headerRef = useRef(null)
  const [classes, setClasses] = useState('')
  const router = useRouter()

  useEffect(() => {
    /**
     * Observe when header (h1 element) moves in/outside a certain area.
     * It is used to add the border at the bottom of sticky header (border-b-2 class).
     * The logic is oposite to "common" observer approach:
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
  },[])

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
        {pageState?.software?.brand_name || ''}
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
        {pageState?.step?.formId ?
          <Button
            tabIndex={0}
            type="submit"
            variant="contained"
            form={pageState?.step?.formId}
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
