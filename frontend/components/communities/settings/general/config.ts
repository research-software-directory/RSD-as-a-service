// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

const config = {
  name: {
    label: 'Name',
    help: 'Community name',
    validation: {
      required: 'Name is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  short_description: {
    label: 'Short description',
    help: 'Short text used in the community card',
    validation: {
      minLength: {value: 6, message: 'Minimum length is 6'},
      maxLength: {value: 300, message: 'Maximum length is 300'},
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
  primary_maintainer: {
    label: 'Primary maintainer',
    help: 'Provide account id of the primary maintainer.',
    validation: {
      minLength: {value: 36, message: 'Minimum length is 36'},
      maxLength: {value: 36, message: 'Maximum length is 36'}
    }
  },
  keywords: {
    label: 'Find or add keyword',
    help: 'Select from top 30 list or start typing for more suggestions',
    validation: {
      //use in find keyword input box
      minLength: 1,
    }
  },
}

export default config
