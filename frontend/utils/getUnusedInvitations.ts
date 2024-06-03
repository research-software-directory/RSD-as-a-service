// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Invitation} from '~/types/Invitation'
import {createJsonHeaders} from './fetchHelpers'

export async function getUnusedInvitations(type: 'software' | 'project' | 'organisation', id: string, token?: string) {
  const resp = await fetch(`/api/v1/invite_maintainer_for_${type}?select=id,created_at,expires_at&order=created_at&${type}=eq.${id}&claimed_by=is.null&claimed_at=is.null`, {
    headers: createJsonHeaders(token)
  })
  const respJson: Invitation[] = await resp.json()
  respJson.forEach(invitation => {
    invitation.type = type
  })
  return respJson
}
