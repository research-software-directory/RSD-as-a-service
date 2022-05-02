
import logger from '../../utils/logger'

export const claims = {
  id_token:
  {
    schac_home_organization: null,
    name: null,
    email: null
  }
}

export function getEncodedClaims(claims: any) {
  return encodeURIComponent(JSON.stringify(claims))
}

export type RedirectToProps = {
  authorization_endpoint: string,
  redirect_uri: string,
  client_id: string,
  scope: string,
  response_mode: string,
  claims: any
}

export async function getAuthorisationEndpoint(wellknownUrl: string){
  const resp = await fetch(wellknownUrl)
  if (resp.status === 200) {
    const data: any = await resp.json()
    if (data['authorization_endpoint']) {
      return data['authorization_endpoint'] as string
    } else {
      logger('getAuthorisationEndpoint failed: authorization_endpoint property MISSING', 'error')
      // return null
    }
  } else {
    logger(`getAuthorisationEndpoint failed: ${resp.statusText}`, 'error')
    // return null
  }
}

export function getRedirectUrl(props: RedirectToProps) {
  const redirectUrl = props.authorization_endpoint +
    '?redirect_uri=' + props.redirect_uri +
    '&client_id=' + props.client_id +
    '&scope=' + props.scope +
    '&response_type=code' +
    '&response_mode=' + props.response_mode +
    '&prompt=login+consent' +
    '&claims=' + getEncodedClaims(claims)
  return redirectUrl
}
