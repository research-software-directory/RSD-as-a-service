
import logger from './logger'

async function getEnvInfo(provider: string) {
  const url = `/api/fe/auth/${provider}`
  let resp = await fetch(url)
  if (resp.status == 200) {
    const json = await resp.json()
    if (json?.env) {
      return json.env
    }
    return null
  } else {
    logger(`getEnvInfo failed: ${resp.statusText}`, 'error')
    return null
  }
}

export async function getRedirectUrl(provider: string) {
  // get environment variables for this provider
  let env = await getEnvInfo(provider)
  const wellknown = env?.NEXT_PUBLIC_SURFCONEXT_WELL_KNOWN_URL || 'http'
  // get other info from providers wellknow endpoint
  const resp = await fetch(wellknown)
  if (resp.status===200){
    const data: any = await resp.json()
    const redirectTo = `${data['authorization_endpoint']}?redirect_uri=${env?.NEXT_PUBLIC_SURFCONEXT_REDIRECT}&client_id=${env?.NEXT_PUBLIC_SURFCONEXT_CLIENT_ID}&scope=openid&response_type=code&response_mode=form_post&prompt=login+consent`
    return redirectTo
  } else {
    logger(`getRedirectUrl.welknown failed: ${resp.statusText}`,'error')
    return undefined
  }
}
