// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export const projectInformation = {
  slug: {
    label: 'RSD path',
    help: 'Use letters, numbers and dash "-". Other characters are not allowed.',
    // react-hook-form validation rules
    validation: {
      required: 'Slug is required',
      minLength: { value: 3, message: 'Minimum length is 3' },
      maxLength: { value: 200, message: 'Maximum length is 200' },
      pattern: {
        value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
        message: 'Use letters, numbers and dash "-". Other characters are not allowed.'
      }
    }
  },
  title: {
    label: 'Title',
    help: 'Project title used as a title of your page.',
    // react-hook-form validation rules
    validation: {
      required: 'Title is required',
      minLength: { value: 3, message: 'Minimum length is 3' },
      maxLength: { value: 200, message: 'Maximum length is 200' },
    }
  },
  subtitle: {
    label: 'Subtitle',
    help: 'Project subtitle.',
    // react-hook-form validation rules
    validation: {
      // required: 'Subtitle is optional',
      minLength: { value: 3, message: 'Minimum length is 3' },
      maxLength: { value: 300, message: 'Maximum length is 300' },
    }
  },
  description: {
    title: 'Project description',
    subtitle: 'The image will apear above the description',
    validation: {
      maxLength: { value: 10000 },
    }
  },
  is_published: {
    label: 'Published',
  },
  date_start: {
    label: 'Start date'
  },
  date_end: {
    label: 'End date'
  },
  grant_id: {
    label: 'Grant ID'
  },
  funding_organisations: {
    title: 'Funding',
    subtitle: 'Funding organisations',
    label: 'Find funding organisation',
    help: 'Search by name in RSD and ROR databases',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 2,
    }
  },
  research_domain: {
    title: 'Research domains',
    subtitle: 'ERC classification',
    label: 'Select main research domain and field'
  },
  keywords: {
    title: 'Keywords',
    subtitle: 'How to find this project?',
    label: 'Find or add keyword',
    help: 'Start typing for the suggestions',
    validation: {
      //custom validation rule, not in used by react-hook-form
      minLength: 1,
    }
  },
  url_for_project: {
    sectionTitle: 'Project links',
    sectionSubtitle: 'Useful external links',
    title: {
      label: 'Link text',
      placeholder: 'Title',
      validation: {
        required: 'Link title is required',
      }
    },
    url: {
      label: 'Link url',
      placeholder: 'Url',
      validation: {
        required: 'Link url is required',
        pattern: {
          value: /^https?:\/\/.+\..+/,
          message: 'Url should start with http(s):// and have at least one dot (.)'
        }
      }
    }
  }
}
