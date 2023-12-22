// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

const config = {
  position: {
    label: 'Position',
    help: 'Order in the menu',
    // react-hook-form validation rules
    validation: {
      required: 'Position is required'
    }
  },
  slug: {
    label: 'RSD path (slug)',
    help: '',
    baseUrl: () => {
      if (typeof location != 'undefined') {
        return `${location.origin}/page/`
      }
      return '/page'
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
  title: {
    label: 'Title (link label)',
    help: 'Title used in the link.',
    // react-hook-form validation rules
    validation: {
      required: 'Title is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  is_published: {
    label: 'Published',
  },
  // field for markdown
  description: {
    label: 'Page content (markdown)',
    help: (brand_name: string) => `What ${brand_name} can do for you`,
    validation: {
      // we do not show error message for this one, we use only maxLength value
      maxLength: {value: 30000, message: 'Maximum length is 30000'},
    }
  },
}

export default config
