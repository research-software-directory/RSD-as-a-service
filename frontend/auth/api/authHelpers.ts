
import {createJsonHeaders} from '~/utils/fetchHelpers'
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

// TEMP solution - should point to auth module route not postgrest
// export async function getProjectInvite({id, token, frontend = false}: { id: string, token: string, frontend?: boolean}) {
//   try {
//     const query = `invite_maintainer_for_project?id=eq.${id}`
//     let url = `${process.env.POSTGREST_URL}/${query}`
//     if (frontend) {
//       url = `/api/v1/${query}`
//     }
//     console.log('url...', url)
//     const resp = await fetch(url, {
//       method: 'GET',
//       headers: {
//         ...createJsonHeaders(token),
//       'Accept':'application/vnd.pgrst.object + json',
//       },
//     })
//     if (resp.status === 200) {
//       const json = await resp.json()
//       if (json && json.project) {
//         return json.project
//       }
//       logger('getProjectInvite failed: project property missing', 'error')
//     } else {
//       logger(`getProjectInvite failed: ${resp?.status} ${resp.statusText}`, 'error')
//     }
//   } catch (e: any) {
//     logger(`getProjectInvite failed: ${e?.message}`, 'error')
//   }
// }

export async function claimProjectMaintainerInvite({id, token, frontend = false}:
  {id: string, token: string, frontend?:boolean}) {
  try {
    const query = 'rpc/accept_invitation_project'
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend) {
      url = `/api/v1/${query}`
    }
    // console.log('url...', url)
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Accept': 'application/vnd.pgrst.object + json',
      },
      body: JSON.stringify({
        'invitation': id
      })
    })
    if (resp.status === 200) {
      const json = await resp.json()
      return json
    } else {
      logger(`claimProjectMaintainerInvite failed: ${resp?.status} ${resp.statusText}`, 'error')
    }
  } catch (e: any) {
    logger(`claimProjectMaintainerInvite failed: ${e?.message}`, 'error')
  }
}
