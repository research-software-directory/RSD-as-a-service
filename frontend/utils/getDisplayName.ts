import {Contributor} from '../types/Contributor'

export function getDisplayName(contributor: Contributor|undefined) {
  let displayName = null
  // start with given names (first name)
  if (contributor?.given_names) {
    displayName = contributor.given_names
  }
  // then family names
  if (contributor?.family_names) {
    displayName += ` ${contributor.family_names}`
  }
  return displayName
}

export function getDisplayInitials(contributor: Contributor|undefined) {
  let displayInitials = ''
  // start with given names (first name)
  if (contributor?.given_names) {
    // take first char
    displayInitials = contributor.given_names[0]
  }
  // then family names
  if (contributor?.family_names) {
    // take first char of each family name part
    displayInitials += `${contributor.family_names.split(' ').map(i => i[0]).join('')}`
  }
  return displayInitials
}
