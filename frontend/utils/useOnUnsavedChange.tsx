// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {useRouter} from 'next/router'
import nprogress from 'nprogress'

function onRouteChangeNext(e:any,warning:string) {
  // console.log('onRouteChangeNext...e...', e)
  // notify user about unsaved changes
  const leavePage = confirm(warning)
  // if user wants to stay
  if (leavePage === false) {
    // set progres to done (otherwise it will hang)
    nprogress.done()
    // we need to throw error here to cancel navigation
    // at this moment there is no 'handler' to cancel navigation.
    // This workaround is based on this issue https://github.com/vercel/next.js/issues/2476
    throw 'Abort navigation'
  }
}

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
  const router = useRouter()
  useEffect(() => {
    // needs to be registered fn in order to remove it on unload
    const handleRouteChange = (...args:any) => {
      onRouteChangeNext(args,warning)
    }
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
    // NEXT router
    if (isDirty) {
      // console.log('useUnsavedChanges.isDirty...listen to routeChangeStart')
      router.events.on('routeChangeStart', handleRouteChange)
    } else {
      // console.log('useUnsavedChanges.isDirty...REMOVE listen routeChangeStart')
      router.events.off('routeChangeStart', handleRouteChange)
    }
    return () => {
      // console.log('useUnsavedChanges...unloading')
      // remove even from NEXT router
      router.events.off('routeChangeStart', handleRouteChange)
      // remove event from window
      window.removeEventListener('beforeunload', handleBrowserChange)
    }
  }, [isDirty,router.events, warning])
}
