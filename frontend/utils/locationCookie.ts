
export function saveLocationCookie() {
  // only in browser mode
  if (typeof document == 'undefined') return
  if (typeof location == 'undefined') return
  // console.group('saveLocationCookie')
  // console.log('path...', location.pathname)
  // console.groupEnd()
  switch (location.pathname.toLowerCase()) {
    // ingnore these paths
    case '/login':
    case '/logout':
      break
    default:
      // write simple browser cookie
      // auth module use this cookie to redirect
      // after succefull authentications
      document.cookie = `rsd_pathname=${location.href};path=/`
  }
}
