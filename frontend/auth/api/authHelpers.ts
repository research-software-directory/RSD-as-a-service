// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'

export type RedirectToProps = {
  authorization_endpoint: string,
  redirect_uri: string,
  client_id: string,
  scope: string,
  response_mode: string,
  prompt?: string,
  redirect_couple_uri?:string | null,
  claims?: any
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
  let redirectUrl = props.authorization_endpoint +
    '?redirect_uri=' + props.redirect_uri +
    '&client_id=' + props.client_id +
    '&scope=' + props.scope +
    '&response_type=code' +
    '&response_mode=' + props.response_mode

  if (props?.prompt) {
    redirectUrl += '&prompt=' + props.prompt
  }

  if (props?.claims){
    redirectUrl += '&claims=' + encodeURIComponent(JSON.stringify(props.claims))
  }

  return redirectUrl
}

export async function claimProjectMaintainerInvite({id, token}:
{id: string, token?: string}) {
  try {
    const query = 'rpc/accept_invitation_project'
    const url = `${getBaseUrl()}/${query}`
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
      return {
        projectInfo: json as {
          title: string
          slug: string
        },
        error: null
      }
    }
    logger(`claimProjectMaintainerInvite failed: ${resp?.status} ${resp.statusText}`, 'error')
    const error = await extractReturnMessage(resp)
    return {
      projectInfo: null,
      error
    }
  } catch (e: any) {
    logger(`claimProjectMaintainerInvite failed: ${e?.message}`, 'error')
    return {
      projectInfo: null,
      error: {
        status: 500,
        message: e?.message
      }
    }
  }
}


export async function claimSoftwareMaintainerInvite({id, token}:
{id: string, token?: string}) {
  try {
    const query = 'rpc/accept_invitation_software'
    const url = `${getBaseUrl()}/${query}`
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
      return {
        softwareInfo: json as {
          brand_name: string
          slug: string
        },
        error: null
      }
    }
    logger(`claimSoftwareMaintainerInvite failed: ${resp?.status} ${resp.statusText}`, 'error')
    const error = await extractReturnMessage(resp)
    return {
      softwareInfo: null,
      error
    }
  } catch (e: any) {
    logger(`claimSoftwareMaintainerInvite failed: ${e?.message}`, 'error')
    return {
      softwareInfo: null,
      error: {
        status: 500,
        message: e?.message
      }
    }
  }
}

export async function claimOrganisationMaintainerInvite({id, token}:
{id: string, token?: string}) {
  try {
    const query = 'rpc/accept_invitation_organisation'
    const url = `${getBaseUrl()}/${query}`
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
      return {
        organisationInfo: json as {
          id: string
          name: string
        },
        error: null
      }
    }
    logger(`claimOrganisationMaintainerInvite failed: ${resp?.status} ${resp.statusText}`, 'error')
    const error = await extractReturnMessage(resp)
    return {
      organisationInfo: null,
      error
    }
  } catch (e: any) {
    logger(`claimOrganisationMaintainerInvite failed: ${e?.message}`, 'error')
    return {
      organisationInfo: null,
      error: {
        status: 500,
        message: e?.message
      }
    }
  }
}


export async function claimCommunityMaintainerInvite({id, token}:
{id: string, token?: string}) {
  try {
    const query = 'rpc/accept_invitation_community'
    const url = `${getBaseUrl()}/${query}`

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
      return {
        communityInfo: json as {
          id: string
          name: string
          slug: string
        },
        error: null
      }
    }
    logger(`claimCommunityMaintainerInvite failed: ${resp?.status} ${resp.statusText}`, 'error')
    const error = await extractReturnMessage(resp)
    return {
      communityInfo: null,
      error
    }
  } catch (e: any) {
    logger(`claimCommunityMaintainerInvite failed: ${e?.message}`, 'error')
    return {
      communityInfo: null,
      error: {
        status: 500,
        message: e?.message
      }
    }
  }
}
