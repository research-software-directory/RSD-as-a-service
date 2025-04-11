// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

export const projectInformation = {
  sectionTitle: 'Project details',
  slug: {
    label: 'RSD path (admin only)',
    help: '',
    // react-hook-form validation rules
    validation: {
      required: 'Slug is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
        message: 'Use letters, numbers and dash "-". Other characters are not allowed.'
      }
    }
  },
  title: {
    label: 'Title',
    help: '',
    // react-hook-form validation rules
    validation: {
      required: 'Title is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  subtitle: {
    label: 'Subtitle',
    help: '',
    // react-hook-form validation rules
    validation: {
      // required: 'Subtitle is optional',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 300, message: 'Maximum length is 300'},
    }
  },
  description: {
    title: 'Project description',
    subtitle: 'The image will appear above the description.',
    validation: {
      maxLength: {value: 10000},
    }
  },
  pageStatus: {
    title: 'Status',
    subtitle: 'A published project is visible to others.'
  },
  is_published: {
    label: 'Published',
  },
  image_contain: {
    label: 'Fit image into the area (recommended when using logos)',
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
    subtitle: 'Grand id and funding organisations',
    label: 'Find funding organisation',
    help: '',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 2,
    }
  },
  research_domain: {
    title: 'Research domains',
    subtitle: 'ERC classification.',
    infoLink: 'https://erc.europa.eu/news/new-erc-panel-structure-2021-and-2022',
    label: 'Select main research domain and field'
  },
  keywords: {
    title: 'Keywords',
    subtitle: 'How to find this project?',
    label: 'Find or add keyword',
    help: '',
    validation: {
      //custom validation rule, not in used by react-hook-form
      minLength: 1,
    }
  },
  url_for_project: {
    sectionTitle: 'Project links',
    sectionSubtitle: 'Useful external links.',
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
          value: /^https?:\/\/\S+$/,
          message: 'Url should start with http(s):// and cannot include white spaces'
        }
      }
    }
  }
}
