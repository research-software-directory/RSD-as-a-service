
export function saveLocationCookie() {
  // only in browser mode
  if (typeof document == 'undefined') return
  if (typeof location == 'undefined') return
  // for specific routes
  switch (location.pathname.toLowerCase()) {
    // ingnore these paths
    case '/login':
    case '/logout':
      break
    default:
      // write simple browser cookie
      // auth module use this cookie to redirect
      // after succefull authentications
      document.cookie = `rsd_pathname=${location.href};path=/auth;SameSite=None;Secure`
  }
}
