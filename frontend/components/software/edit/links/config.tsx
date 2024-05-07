// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import VerifyGithubUrl from './VerifyGithubUrl'

export const config={
  get_started_url: {
    label: 'Get Started URL',
    help: '',
    validation: {
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https?:\/\/.+\..+/,
        message: 'URL should start with http(s):// and use at least one dot (.)'
      }
    }
  },
  repository_url: {
    label: 'Repository URL',
    help: (repoUrl: string | null) => repoUrl ? <VerifyGithubUrl url={repoUrl}/> : '',
    validation: {
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https?:\/\/.+\..+/,
        message: 'URL should start with http(s)://, have at least one dot (.) and at least one slash (/).'
      }
    }
  },
  repository_platform: {
    label: 'Platform',
    help: 'To scrape repository information',
    options: [
      {label: 'GitHub', value: 'github'},
      {label: 'GitLab', value: 'gitlab'},
      {label: 'Bitbucket', value: 'bitbucket'},
      {label: 'Other', value: 'other'},
    ]
  },
  repository_disabled_scraping_reason: {
    label: 'Reason why scraping is disabled',
    validation: {
      maxLength: {value: 200, message: 'Maximum length is 200'}
    }
  },
  concept_doi: {
    title: 'Software DOI',
    subtitle: 'Provide the DOI of your software. This DOI will be used to import metadata about the software.',
    label: 'Software DOI',
    help: '',
    infoLink: '/documentation/users/adding-software/#software-doi',
    validation: {
      minLength: {value: 7, message: 'Minimum length is 7'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
      pattern: {
        value: /^10(\.\w+)+\/\S+$/,
        message: 'Invalid DOI pattern. Maybe you provided a complete URL?'
      }
    }
  },
  validateConceptDoi: {
    label: 'Validate'
  },
  categories: {
    title: 'Categories',
    subtitle: 'Tell us more about your software.',
    help: 'Assign categories to your software from a predefined catalog of categories.',
  },
  keywords: {
    title: 'Keywords',
    subtitle: 'Add keywords to your software, or import them using the Software DOI.',
    label: 'Find or add keyword',
    help: 'Select from top 30 list or start typing for more suggestions',
    validation: {
      //custom validation rule, not in used by react-hook-form
      minLength: 1,
    }
  },
  importKeywords: {
    label: 'Import keywords',
    message: (doi: string) => `Import keywords from datacite.org using DOI ${doi}`
  },
  licenses:{
    title: 'Licenses',
    subtitle: 'What licenses do apply to your software?',
    label: 'Find or add a license',
    help: 'Select from short list or type first 3 letters for more suggestions',
    validation: {
      //custom validation rule, not in used by react-hook-form
      minLength: 1,
    },
    modal:{
      title: 'Add custom license',
      license:{
        label: 'Short identifier',
        help: '',
        validation: {
          required: true,
          minLength: {value: 3, message: 'Minimum length is 3'},
          maxLength: {value: 100, message: 'Maximum length is 100'},
          pattern: {
            value: /^[a-zA-Z0-9]+(-[a-zA-Z0-9.]+)*$/,
            message: 'Restricted input violation. Use letters, numbers, dashes "-" and dot "." only.'
          }
        }
      },
      name: {
        label: 'Full name',
        help: '',
        validation: {
          required: true,
          minLength: {value: 3, message: 'Minimum length is 3'},
          maxLength: {value: 200, message: 'Maximum length is 200'},
        }
      },
      reference: {
        label: 'License url',
        help: '',
        validation: {
          required: true,
          minLength: {value: 10, message: 'Minimum length is 10'},
          maxLength: {value: 200, message: 'Maximum length is 200'},
          pattern: {
            value: /^https?:\/\/.+\..+/,
            message: 'URL should start with http(s):// and use at least one dot (.)'
          }
        }
      },
      open_source:{
        label: 'This is open source license',
      }
    }
  },
  importLicenses: {
    label: 'Import licenses',
    message: (doi: string) => `Import licenses from datacite.org using DOI ${doi}`
  }
}
