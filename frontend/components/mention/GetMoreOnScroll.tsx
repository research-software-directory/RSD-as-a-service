import {useEffect, useRef} from 'react'
import CircularProgress from '@mui/material/CircularProgress'

type GetMoreOnScroll={
  options: IntersectionObserverInit
  show: boolean
  onLoad:()=>void
}

export default function GetMoreOnScroll({show,options,onLoad}:GetMoreOnScroll){
  const loaderRef = useRef(null)

  useEffect(()=>{
    let observeEl:HTMLElement

    function callOnLoad(entries:IntersectionObserverEntry[]){
      // console.log('callOnLoad...', entries)
      entries.forEach(entry=>{
        // console.log('entry.isIntersecting...', entry.isIntersecting)
        if (entry.isIntersecting){
          // console.log('Calling on load...', entry)
          if (onLoad) onLoad()
        }
      })
    }
    // console.log('useEffect...options...', options)
    const observer = new IntersectionObserver(callOnLoad,options)
    if (loaderRef.current){
      // observe this element
      observeEl = loaderRef.current
      observer.observe(observeEl)
    }
    return ()=>{
      // debugger
      if (observeEl) observer.unobserve(observeEl)
    }
  },[loaderRef,options,onLoad])

  if (show===false) return null

  return (
    <li
      ref={loaderRef}
      aria-label="Loading more items"
      title="Loading more items"
      className="py-4 px-2 flex justify-center cursor-pointer">
      <CircularProgress />
    </li>
  )
}
