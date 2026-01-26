// SPDX-FileCopyrightText: 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {createContext, useContext} from 'react'

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

const ProfileContext = createContext<UserProfile | null>(null)

export function ProfileProvider({value, children}: {value: UserProfile, children: React.ReactNode}) {
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return ctx
}
