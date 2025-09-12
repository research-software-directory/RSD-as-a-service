// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {AutocompleteOption} from '~/types/AutocompleteOptions'
import {OrganisationSource, SearchOrganisation} from '~/types/Organisation'
import {createJsonHeaders} from './fetchHelpers'
import {getSlugFromString} from './getSlugFromString'
import logger from './logger'

export async function findInROR({searchFor}:{searchFor:string}) {
  try {
    // this query will match organisation by name
    // https://ror.readme.io/docs/api-query
    const url = `https://api.ror.org/v2/organizations?query=${encodeURIComponent(searchFor)}`

    // make request
    const resp = await fetch(url, {
      headers: {
        // pass json request in the header
        ...createJsonHeaders(undefined),
      }
    })

    if (resp.status === 200) {
      const json: any = await resp.json()
      return buildAutocompleteOptions(json['items'])
    }
    logger(`findInROR FAILED: ${resp.status}: ${resp.statusText}`, 'warn')
    // we return nothing
    return []
  } catch (e:any) {
    logger(`findInROR: ${e?.message}`, 'error')
    return []
  }
}

function buildAutocompleteOptions(rorItems: RORItem[]): AutocompleteOption<SearchOrganisation>[] {
  if (rorItems === undefined || rorItems.length === 0) return []

  const options = rorItems.map(item => {
    try {
      const name = item.names
        .filter(name => name.types.includes('ror_display'))
        .map(name => name.value)[0]
      const slug = getSlugFromString(name)

      const wikipediaUrls = item.links.filter(link => link.type === 'wikipedia')

      const websites = item.links ? item.links.filter(link => link.type === 'website') : null

      const firstAddress = item.locations.length ? item.locations[0] : null

      return {
        // we use ror_id as primary key
        key: item?.id ?? slug,
        label: name,
        data: {
          id: null,
          parent: null,
          primary_maintainer: null,
          slug,
          name: name,
          short_description: null,
          description: null,
          ror_id: item.id,
          website: websites?.length ? websites[0].value : null,
          is_tenant: false,
          country: firstAddress?.geonames_details?.country_name ?? null,
          city: firstAddress?.geonames_details?.name ?? null,
          wikipedia_url: wikipediaUrls.length ? wikipediaUrls[0].value : null,
          ror_types: item.types ?? [],
          logo_id: null,
          source: 'ROR' as OrganisationSource
        }
      }
    } catch (e: any) {
      logger(`Could not parse ROR v2 item with error ${e} and value ${JSON.stringify(item)}`, 'error')
      return null
    }
  })

  return options.filter(item => item !== null)
}

// https://github.com/ror-community/ror-schema/blob/master/example_record_v2_1.json
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rorV2Item = {
  'locations': [
    {
      'geonames_id': 5378538,
      'geonames_details': {
        'continent_code': 'NA',
        'continent_name': 'North America',
        'country_code': 'US',
        'country_name': 'United States',
        'country_subdivision_code': 'CA',
        'country_subdivision_name': 'California',
        'lat': 37.802168,
        'lng': -122.271281,
        'name': 'Oakland'
      }
    }
  ],
  'established': 1868,
  'external_ids': [
    {
      'type': 'fundref',
      'all': [
        '100005595',
        '100009350',
        '100004802',
        '100010574',
        '100005188',
        '100005192'
      ],
      'preferred': '100005595'
    },
    {
      'type': 'grid',
      'all': [
        'grid.30389.31'
      ],
      'preferred': 'grid.30389.31'
    },
    {
      'type': 'isni',
      'all': [
        '0000 0001 2348 0690'
      ],
      'preferred': null
    }
  ],
  'id': 'https://ror.org/00pjdza24',
  'domains': [
    'universityofcalifornia.edu'
  ],
  'links': [
    {
      'type': 'website',
      'value': 'http://www.universityofcalifornia.edu/'
    },
    {
      'type': 'wikipedia',
      'value': 'http://en.wikipedia.org/wiki/University_of_California'
    }
  ],
  'names': [
    {
      'value': 'UC',
      'types': [
        'acronym'
      ],
      'lang': 'en'
    },
    {
      'value': 'UC System',
      'types': [
        'alias'
      ],
      'lang': 'en'
    },
    {
      'value': 'University of California System',
      'types': [
        'ror_display',
        'label'
      ],
      'lang': 'en'
    },
    {
      'value': 'Université de Californie',
      'types': [
        'label'
      ],
      'lang': 'fr'
    }
  ],
  'relationships': [
    {
      'id': 'https://ror.org/02jbv0t02',
      'label': 'Lawrence Berkeley National Laboratory',
      'type': 'related'
    },
    {
      'id': 'https://ror.org/03yrm5c26',
      'label': 'California Digital Library',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/00zv0wd17',
      'label': 'Center for Information Technology Research in the Interest of Society',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/03t0t6y08',
      'label': 'University of California Division of Agriculture and Natural Resources',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/01an7q238',
      'label': 'University of California, Berkeley',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/05rrcem69',
      'label': 'University of California, Davis',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/04gyf1771',
      'label': 'University of California, Irvine',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/046rm7j60',
      'label': 'University of California, Los Angeles',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/00d9ah105',
      'label': 'University of California, Merced',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/03nawhv43',
      'label': 'University of California, Riverside',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/0168r3w48',
      'label': 'University of California, San Diego',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/043mz5j54',
      'label': 'University of California, San Francisco',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/02t274463',
      'label': 'University of California, Santa Barbara',
      'type': 'child'
    },
    {
      'id': 'https://ror.org/03s65by71',
      'label': 'University of California, Santa Cruz',
      'type': 'child'
    }
  ],
  'status': 'active',
  'types': [
    'education'
  ],
  'admin': {
    'created': {
      'date': '2020-04-25',
      'schema_version': '1.0'
    },
    'last_modified': {
      'date': '2022-10-18',
      'schema_version': '2.0'
    }
  }
}

type RORItem = typeof rorV2Item
