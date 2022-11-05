// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {columsForUpdate, OrganisationForOverview} from '~/types/Organisation'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import {getPropsFromObject} from '~/utils/getPropsFromObject'

export default async function updateOrganisationSettings({item, token}:
  { item: OrganisationForOverview, token: string }) {
  try {
    // extract only required items
    const organisation = getPropsFromObject(item, columsForUpdate)

    const url = `/api/v1/organisation?id=eq.${item.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(organisation)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchOrganisationTable({id, data, token}:
  {id:string, data: any, token: string }) {
  try {
    // extract only required items
     const url = `/api/v1/organisation?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}
