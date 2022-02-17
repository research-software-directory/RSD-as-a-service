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
 * Spliting display name in given_names and family_names.
 * Simply we use first word as given name and the rest as family names
 * @param name
 * @returns
 */
export function splitName(name: string) {
  const names = name.split(' ')
  return {
    given_names: names[0],
    family_names: names.slice(1).join(' ')
  }
}
