// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2025 dv4all
// SPDX-FileCopyrightText: 2022 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {isProperUrl} from '~/utils/fetchHelpers'

export const softwareInformation = {
  slug: {
    label: 'RSD path (admin only)',
    help: '',
    // react-hook-form validation rules
    validation: {
      required: 'Slug is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 250, message: 'Maximum length is 250'},
      pattern: {
        value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
        message: 'Use letters, numbers and dash "-". Other characters are not allowed.'
      }
    }
  },
  brand_name: {
    label: 'Software Name',
    help: '',
    // react-hook-form validation rules
    validation: {
      required: 'Name is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 250, message: 'Maximum length is 250'},
    }
  },
  short_statement: {
    label: 'Short description',
    help: '',
    validation: {
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 300, message: 'Maximum length is 300'},
    }
  },
  // field for Markdown
  description: {
    label: 'Description',
    help: {
      url: '/documentation/users/adding-software/#description',
      ariaLabel: 'Description, link to documentation page opens in new tab'
    },
    validation: {
      // we do not show error message for this one, we use only maxLength value
      maxLength: {value: 10000, message: 'Maximum length is 10000'},
    }
  },
  // field for logo upload
  logo: {
    label: 'Software Logo',
    help: 'Upload a logo of your software.'
  },
  // field for Markdown URL
  description_url: {
    label: 'URL of (raw) Markdown file',
    help: <>
      Read <u><a href="/documentation/users/adding-software/#markdown-url" target="_blank">here</a></u> how to properly link to a raw Markdown URL
    </>,
    validation: {
      required: 'Valid markdown URL is required',
      maxLength: {value: 200, message: 'Maximum length is 200'},
      // custom validation function for correct url syntax
      validate: (url:string)=>{
        // return error message if not correct url syntax
        if (!isProperUrl(url)){
          return 'Invalid url. Please improve your input'
        }
        // has correct url syntax
        return true
      }
    }
  },
  pageStatus: {
    title: 'Status',
    subtitle: 'A published software is visible to others.'
  },
  is_published: {
    label: 'Published',
  }
}


export const contributorInformation = {
  findContributor: {
    title: 'Add contributor',
    subtitle: (include_orcid:boolean=true) => {
      if (include_orcid) {
        return 'We search by name or ORCID in RSD and ORCID databases'
      }
      return 'We search by name or ORCID in RSD database'
    },
    label: 'Find or add contributor',
    help: 'Type at least 2 letters, use first name, last name or ORCID',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 2,
    }
  },
  importContributors: {
    title: 'Import contributors',
    subtitle: 'We use your software DOI to retrieve information about the contributors',
    infoLink: {
      url:'/documentation/users/adding-software/#contributors',
      ariaLabel: 'Import contributors, link to documentation page opens in new tab'
    },
    label: 'Import contributors',
    message: (doi: string) => `Import contributors from datacite.org using DOI ${doi}`
  }
}


export const organisationInformation = {
  title: 'Participating organisations',
  modalTitle: 'Organisation',
  findOrganisation: {
    title: 'Add organisation',
    subtitle: 'We search by name in the RSD and the ROR databases',
    label: 'Find or add organisation',
    help: 'Type at least first 2 letters of the organisation name',
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
      // required: 'Website is required',
      minLength: {value: 6, message: 'Minimum length is 6'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https?:\/\/\S+$/,
        message: 'URL should start with http(s):// and cannot include white spaces'
      }
    }
  },
  slug: {
    label: 'RSD path',
    help: 'Partial RSD URL for this organisation (slug)',
    validation: {
      required: 'The rsd path is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  ror_id: {
    label: 'ROR id'
  },
}


export const testimonialInformation = {
  message: {
    label: 'Message',
    help: 'What credits the software received?',
    validation: {
      required: 'The message is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 500, message: 'Maximum length is 500'},
    }
  },
  source: {
    label: 'Source',
    help: 'Who provided the credits?',
    validation: {
      required: 'The source of the testimonial is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  }
}
