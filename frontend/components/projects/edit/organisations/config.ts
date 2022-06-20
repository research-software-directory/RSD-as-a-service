// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export const cfgOrganisations = {
  title: 'Participating organisations',
  findOrganisation: {
    title: 'Add organisation',
    subtitle: 'We search by name in the RSD and the ROR databases',
    label: 'Find or add organisation',
    help: 'At least the fist 2 letters of the organisation name',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 2,
    }
  },
  name: {
    label: 'Name',
    help: 'Participating organisation',
    validation: {
      required: 'Organisation name is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  website: {
    label: 'Website',
    help: 'Web address including http(s)',
    validation: {
      required: 'Website is required',
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
    help: 'Partial RSD url for this organisation (slug)',
    validation: {
      required: 'The rsd path is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  ror_id: {
    label: 'ROR id'
  }
}
