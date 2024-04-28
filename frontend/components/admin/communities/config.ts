// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

const config = {
  rsdRootPath:'communities',
  modalTitle:'Add community',
  slug: {
    label: 'RSD path (slug)',
    help: 'The location of this community',
    baseUrl: () => {
      if (typeof location != 'undefined') {
        return `${location.origin}/community/`
      }
      return '/community'
    },
    // react-hook-form validation rules
    validation: {
      required: 'Slug is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
      pattern: {
        value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
        message: 'Use letters, numbers and dash "-". Other characters are not allowed.'
      }
    }
  },
  name: {
    label: 'Name',
    help: 'Community name shown in the card.',
    // react-hook-form validation rules
    validation: {
      required: 'Name is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  short_description: {
    label: 'Short description',
    help: 'Describe in short what is this community about.',
    validation: {
      // we do not show error message for this one, we use only maxLength value
      maxLength: {value: 300, message: 'Maximum length is 300'},
    }
  },
  // field for markdown
  description: {
    label: 'About page',
    help: '',
    validation: {
      // we do not show error message for this one, we use only maxLength value
      maxLength: {value: 10000, message: 'Maximum length is 10000'},
    }
  },
}

export default config
