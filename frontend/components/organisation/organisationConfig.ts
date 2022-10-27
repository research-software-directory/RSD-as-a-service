// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * The labels and config for edit organisation modal
 * used in Settings and ResearchUnitsModal
 * NOTE! The similair configuration exists for editing
 * participating organisations in the software folder.
 * This file is adjusted copy of
 * ./components/software/edit/editSoftwareConfig
 */
export const organisationInformation = {
  name: {
    label: 'Name',
    help: 'Organisation, institution or research unit name',
    validation: {
      required: 'Name is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  website: {
    label: 'Website',
    help: 'Web address including http(s)',
    validation: {
      minLength: {value: 6, message: 'Minimum length is 6'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https?:\/\/.+\..+/,
        message: 'Url should start with http(s):// and have at least one dot (.)'
      }
    }
  },
  slug: {
    label: 'RSD path',
    help: 'Use letters, numbers and dash "-". Other characters are not allowed.',
    validation: {
      required: 'Rsd path is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
        message: 'Use letters, numbers and dash "-". Other characters are not allowed.'
      }
    }
  },
  ror_id: {
    label: 'ROR id',
    help: 'ROR id starts with https://ror.org/',
    validation: {
      minLength: {value: 16, message: 'Minimum length is 16'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https:\/\/ror.org\/.+/,
        message: 'ROR id is url and starts with https://ror.org/'
      }
    }
  },
  primary_maintainer: {
    label: 'Primary maintainer',
    help: 'Provide account id of the primary maintainer.',
    validation: {
      minLength: {value: 36, message: 'Minimum length is 36'},
      maxLength: {value: 36, message: 'Maximum length is 36'}
    }
  },
  is_tenant: {
    label: 'Official member',
    help: 'Set to active if organisation is participating in RSD.',
  },
  description: {
    title: 'About page',
    subtitle: 'Provide the content of about page. If content is not provided about page is hidden.',
    validation: {
      minLength: {value: 16, message: 'Minimum length is 16'},
      maxLength: {value: 10000, message: 'Maximum length is 10.000'},
    }
  }
}
