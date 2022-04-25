
import logger from './logger'

export const claims = {
  id_token:
  {
    schac_home_organization: null,
    name: null,
    email: null
  }
}

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

export function getEncodedClaims(claims: any) {
  return encodeURIComponent(JSON.stringify(claims))
}

export async function getRedirectUrl(provider: string) {
  // get environment variables for this provider
  let env = await getEnvInfo(provider)

  if (!env) {
    return undefined
  }

  const envVarNamePrefix = 'NEXT_PUBLIC_' + provider.toUpperCase() + '_'
  const wellknownEnvVar = envVarNamePrefix + 'WELL_KNOWN_URL'
  const wellknownUrl = env[wellknownEnvVar] || 'http'

  const redirectEnvVar = envVarNamePrefix + 'REDIRECT'
  const redirectVal = env[redirectEnvVar]

  const clientIdEnvVar = envVarNamePrefix + 'CLIENT_ID'
  const clientIdVal = env[clientIdEnvVar]

  const responseModeEnvVar = envVarNamePrefix + 'RESPONSE_MODE'
  const responseModeVal = env[responseModeEnvVar]

  const scopesEnvVar = envVarNamePrefix + 'SCOPES'
  const scopesVal = env[scopesEnvVar]

  // get other info from providers wellknow endpoint
  const resp = await fetch(wellknownUrl)

  if (resp.status === 200) {
    const data: any = await resp.json()
    const urlEncodedClaims = getEncodedClaims(claims)
    const redirectTo = data['authorization_endpoint'] +
      '?redirect_uri=' + redirectVal +
      '&client_id=' + clientIdVal +
      '&scope=' + scopesVal +
      '&response_type=code&response_mode=' + responseModeVal +
      '&prompt=login+consent' +
      '&claims=' + urlEncodedClaims
    return redirectTo
  } else {
    logger(`getRedirectUrl.wellknown failed: ${resp.statusText}`,'error')
    return undefined
  }
}
