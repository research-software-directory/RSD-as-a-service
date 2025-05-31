// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Return a list of valid OpenID providers
 * based on provided env. RSD_AUTH_PROVIDERS string, semicolon separated values
 * Example! RSD_AUTH_PROVIDERS=surfconext:everyone;helmholtz:invites_only
 */

export type AccessType = 'INVITE_ONLY' | 'EVERYONE'

export type Provider = {
  openidProvider: 'local' | 'surfconext' | 'helmholtz' | 'orcid' | 'azure' | 'linkedin',
  name: string,
  signInUrl: string,
  accessType: AccessType,
  html: string
}
