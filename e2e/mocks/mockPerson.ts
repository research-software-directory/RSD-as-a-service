import {generateId} from '../helpers/utils'

export type Person = typeof randomPerson.chromium

export const randomPerson = {
  chromium: {
    name: `John Doe ${generateId()}`,
    email: `test${generateId()}@example.com`,
    role: `Senior Developer ${generateId()}`,
    affiliation: `Affiliation company ${generateId()}`,
    avatar: 'images/dmijat_2007.jpg',
    apiUrl: '/pub.orcid.org/',
    orcid: '0000-0002-1898-4461'
  },
  firefox: {
    name: `John Doe ${generateId()}`,
    email: `test${generateId()}@example.com`,
    role: `Senior Developer ${generateId()}`,
    affiliation: `Affiliation company ${generateId()}`,
    avatar: 'images/dmijat_2007.jpg',
    apiUrl: '/pub.orcid.org/',
    orcid: '0000-0002-1898-4461'
  },
  webkit: {
    name: `John Doe ${generateId()}`,
    email: `test${generateId()}@example.com`,
    role: `Senior Developer ${generateId()}`,
    affiliation: `Affiliation company ${generateId()}`,
    avatar: 'images/dmijat_2007.jpg',
    apiUrl: '/pub.orcid.org/',
    orcid: '0000-0002-1898-4461'
  }
}
