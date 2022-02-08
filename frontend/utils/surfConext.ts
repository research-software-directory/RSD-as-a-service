
import logger from './logger'

export async function getRedirectUrl() {
  const wellknown = process.env.NEXT_PUBLIC_SURFCONEXT_WELL_KNOWN_URL || 'http'
  const resp = await fetch(wellknown)
  if (resp.status===200){
    const data: any = await resp.json()
    const redirectTo = `${data['authorization_endpoint']}?redirect_uri=${process.env.NEXT_PUBLIC_SURFCONEXT_REDIRECT}&client_id=${process.env.NEXT_PUBLIC_SURFCONEXT_CLIENT_ID}&scope=openid&response_type=code&response_mode=form_post&prompt=login+consent`
    // logger(`loginWithSurf.redirectTo: ${resp.statusText}`, 'info')
    return redirectTo
  } else {
    logger(`loginWithSurf.welknown failed: ${resp.statusText}`,'error')
    return undefined
  }
}
