// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useCallback, useState, useEffect} from 'react'
import useSnackbar from '~/components/snackbar/useSnackbar'

import {useSession} from '~/auth/AuthProvider'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {getSoftwareForMaintainer, SoftwareByMaintainer} from '~/components/user/software/useUserSoftware'

export type getPublicProfileProps = {
  account: string
  token?: string
}

export async function getPublicProfileDataOld({account, token}: getPublicProfileProps) {
  try {
    const url = getBaseUrl() + `/user_profile?account=eq.${account}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: UserProfile[] = await resp.json()
      return data[0]
    }
    logger(`getPublicProfileData not 200: ${resp.status} - ${resp.body}`, 'error')
    return null
  } catch (e: any) {
    logger(`getPublicProfileData: ${e?.message}`, 'error')
    return null
  }
}

export type UserProfile = {
  account: string
  given_names: string
  family_names: string
  email_address: string
  role: string
  affiliation: string
  is_public: boolean
  avatar_id: string
  description: string
  created_at: string
  updated_at: string
}

export function useUserProfile(account: string, searchFor?: string) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<UserProfile | null>()
  const [profileSoftware, setProfileSoftware] = useState<SoftwareByMaintainer[]>()

  const getProfileData = useCallback(async () => {
    setLoading(true)
    const data: UserProfile | null = await getPublicProfileDataOld({account, token})
    setProfileData(data)
    setLoading(false)
  }, [token])

  const getProfileSoftware = useCallback(async () => {
    setLoading(true)
    const {software} = await getSoftwareForMaintainer({
      searchFor,
      page: 0,
      rows: 0,
      token,
      account
    })
    setProfileSoftware(software)
    setLoading(false)
  }, [token])

  useEffect(() => {
    getProfileData()
    getProfileSoftware()
  }, [getProfileData, getProfileSoftware])

  return {
    profileData,
    profileSoftware
  }
}
