// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

export const cfgOrganisations = {
  title: 'Participating organisations',
  findOrganisation: {
    title: 'Add organisation',
    subtitle: 'We search by name in the RSD and the ROR databases',
    label: 'Find or add organisation',
    help: 'At least the first 2 letters of the organisation name',
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
        value: /^https?:\/\/\S+$/,
        message: 'Url must start with http(s):// and cannot include white spaces'
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
