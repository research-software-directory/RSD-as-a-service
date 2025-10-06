// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect} from 'react'

/**
 * NOTE! I have not found a way to show custom message at this stage of page navigation
 * @param e
 * @param warning
 */
function onWebsiteChange(e: any, warning: string) {
  // If you prevent default behavior in Mozilla Firefox prompt will always be shown
  e.preventDefault()
  // Chrome requires returnValue to be set, but it does not shows custom message
  e.returnValue = warning
  // the absence of a returnValue property on the event will guarantee the browser unload happens
  // mozilla docs https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
  delete e['returnValue']
}


export default function useOnUnsavedChange({
  isDirty, warning
}:{
  isDirty: boolean, warning:string
}) {
  // const router = useRouter()
  useEffect(() => {
    // needs to be registered fn in order to remove it on unload
    const handleBrowserChange = (e:any) => {
      onWebsiteChange(e,warning)
    }
    // BROWSER window
    if (isDirty) {
      // console.log('useUnsavedChanges.isDirty...listen to onbeforeunload')
      window.addEventListener('beforeunload', handleBrowserChange)
    } else {
      // console.log('useUnsavedChanges.isDirty...REMOVE onbeforeunload')
      window.removeEventListener('beforeunload', handleBrowserChange)
    }
    return () => {
      // console.log('useUnsavedChanges...unloading')
      // remove event from window
      window.removeEventListener('beforeunload', handleBrowserChange)
    }
  }, [isDirty,warning])
}
