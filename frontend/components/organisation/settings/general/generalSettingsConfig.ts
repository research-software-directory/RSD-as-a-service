// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
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
export const generalSettingsConfig = {
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
        value: /^https?:\/\/\S+$/,
        message: 'Url should start with http(s):// and cannot contain white spaces'
      }
    }
  },
  short_description: {
    label: 'Short description',
    help: 'Short text used in the organisation card',
    validation: {
      minLength: {value: 6, message: 'Minimum length is 6'},
      maxLength: {value: 300, message: 'Maximum length is 300'},
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
        value: /^https:\/\/ror.org\/\S+$/,
        message: 'ROR ID must start with https://ror.org/ and cannot include white spaces'
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
  parent: {
    label: 'Parent organisation ID',
    help: 'Add the ID of the parent organisation.',
    validation: {
      minLength: {value: 36, message: 'Must be 36 characters'},
      maxLength: {value: 36, message: 'Must be 36 characters'}
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

export default generalSettingsConfig
