// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// export function getDisplayName(contributor: Contributor | undefined) {
export function getDisplayName({given_names, family_names}:
{given_names?: string, family_names?: string}) {
  let displayName = null
  // start with given names (first name)
  if (given_names) {
    displayName = given_names
  }
  // then family names
  if (family_names) {
    displayName += ` ${family_names}`
  }
  return displayName
}

export function getDisplayInitials({given_names, family_names}:
{given_names?: string, family_names?: string}) {
  let displayInitials = ''
  // start with given names (first name)
  if (given_names) {
    // take first char
    displayInitials = given_names[0]
  }
  // then family names
  if (family_names) {
    // take first char of each family name part
    displayInitials += `${family_names.split(' ').map(i => i[0]).join('')}`
  }
  return displayInitials
}

/**
 * Splitting display name in given_names and family_names.
 * Simply we use first word as given name and the rest as family names
 * @param name
 * @returns
 */
export function splitName(name: string) {
  if (!name || name === null || name === '') {
    return {
      given_names: '',
      family_names: ''
    }
  }
  const names = name.split(' ')
  return {
    given_names: names[0],
    family_names: names.slice(1).join(' ')
  }
}


export function combineRoleAndAffiliation({role, affiliation}:
{role?: string | null, affiliation?: string | null}) {

  if (role && affiliation) return `${role}, ${affiliation}`

  if (role) return role

  return affiliation ?? ''
}
