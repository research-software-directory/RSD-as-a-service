import {Contributor} from '../types/Contributor'

export function getDisplayName(contributor: Contributor) {
  let displayName = null
  // start with given names (first name)
  if (contributor.given_names) {
    displayName = contributor.given_names
  }
  // add particle, eg. van
  if (contributor.name_particle) {
    displayName += ` ${contributor.name_particle}`
  }
  // then family names
  if (contributor.family_names) {
    displayName += ` ${contributor.family_names}`
  }
  // end with suffix? no prefix
  if (contributor.name_suffix) {
    displayName += ` ${contributor.name_suffix}`
  }
  return displayName
}

export function getDisplayInitials(contributor: Contributor) {
  let displayInitials = ''
  // start with given names (first name)
  if (contributor.given_names) {
    // take first char
    displayInitials = contributor.given_names[0]
  }
  // add particle, eg. van
  if (contributor.name_particle) {
    // split on space and take first chars
    displayInitials += `${contributor.name_particle.split(' ').map(i=>i[0]).join('')}`
  }
  // then family names
  if (contributor.family_names) {
    // take first char
    displayInitials += `${contributor.family_names[0]}`
  }
  return displayInitials
}
