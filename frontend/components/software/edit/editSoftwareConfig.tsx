// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export const softwareInformation = {
  slug: {
    label: 'RSD path',
    help: 'Use letters, numbers and dash "-". Other characters are not allowed.',
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
  brand_name: {
    label: 'Name',
    help: 'Provide software name to use as a title of your software page.',
    // react-hook-form validation rules
    validation: {
      required: 'Name is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  short_statement: {
    label: 'Short description',
    help: 'Provide a short description of your software to use as page subtitle.',
    validation: {
      required: 'Short description is required',
      minLength: {value: 10, message: 'Minimum length is 10'},
      maxLength: {value: 300, message: 'Maximum length is 300'},
    }
  },
  get_started_url: {
    label: 'Get Started URL',
    help: 'Link to documentation for users.',
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
    help: 'Link to source code repository',
    validation: {
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https?:\/\/.+\..+/,
        message: 'URL should start with htps://, have at least one dot (.) and at least one slash (/).'
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
  // field for markdown
  description: {
    label: 'Description',
    help: (brand_name: string) => `What ${brand_name} can do for you`,
    validation: {
      // we do not show error message for this one, we use only maxLength value
      maxLength: {value: 10000, message: 'Maximum length is 10000'},
    }
  },
  // field for logo upload
  logo: {
    label: 'Logo',
    help: 'Upload a logo of your software.'
  },
  // field for markdown URL
  description_url: {
    label: 'URL location of markdown file',
    help: <>Point to the location of markdown file including the filename. Make sure to provide the <u><a target = '_blank' href='https://raw.githubusercontent.com/research-software-directory/RSD-as-a-service/main/README.md' rel="noreferrer">raw file</a></u> and <strong>not</strong> the <u><a target = '_blank' href='https://github.com/research-software-directory/RSD-as-a-service/blob/main/README.md' rel="noreferrer">rendered output</a></u>.</>,
    validation: {
      required: 'Valid markdown URL must be provided',
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https?:\/\/.+\..+.md$/,
        message: 'URL should start with http(s):// have at least one dot (.) and end with (.md)'
      }
    }
  },
  concept_doi: {
    title: 'Citation',
    subtitle: 'We generate citation files using concept DOI',
    label: 'Concept DOI',
    help: <>Concept DOI of your software, i.e. a DOI representing <u><a target = '_blank' href='https://help.zenodo.org/' rel="noreferrer">all of the versions</a></u> of this software</>,
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
    label:'Validate DOI'
  },
  pageStatus: {
    title: 'Status',
    subtitle: 'A published software is visible to others.'
  },
  is_published: {
    label: 'Published',
  },
  keywords: {
    title: 'Keywords',
    subtitle: 'Find, add or import using concept DOI.',
    label: 'Find or add keyword',
    help: 'Select from top 30 list or start typing for the suggestions',
    validation: {
      //custom validation rule, not in used by react-hook-form
      minLength: 1,
    }
  },
  importKeywords: {
    label: 'Import keywords',
    message: (doi: string) => `Import keywords from datacite.org using DOI ${doi}`
  },
  licenses: {
    title: 'Licenses',
    subtitle: 'What licenses do apply to your software? You can also import licenses using concept DOI.',
    label: 'Find or add a license',
    help: 'Start typing for the suggestions',
    validation: {
      //custom validation rule, not in used by react-hook-form
      minLength: 1,
    }
  },
  importLicenses: {
    label: 'Import licenses',
    message: (doi: string) => `Import licenses from datacite.org using DOI ${doi}`
  }
}

export type SoftwareInformationConfig = typeof softwareInformation

export const contributorInformation = {
  findContributor: {
    title: 'Add contributor',
    subtitle: 'We search by name and ORCID in the RSD and the ORCID databases',
    label: 'Find or add contributor',
    help: 'At least 2 letters, use pattern {First name} {Last name} or 0000-0000-0000-0000',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 2,
    }
  },
  importContributors: {
    title: 'Import contributors',
    subtitle: 'We use your concept DOI and datacite.org API',
    label: 'Import contributors',
    message: (doi: string) => `Import contributors from datacite.org using DOI ${doi}`
  },
  is_contact_person: {
    label: 'Contact person',
    help:'Is this contributor main contact person'
  },
  given_names: {
    label: 'First name / Given name(s)',
    help: '',
    validation: {
      required: 'Name is required',
      minLength: {value: 1, message: 'Minimum length is 1'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  family_names: {
    label: 'Last name / Family name(s)',
    help: 'Family names including "de/van/van den"',
    validation: {
      required: 'Family name is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  email_address: {
    label: 'Email',
    help: 'Contact person should have an email',
    validation: {
      minLength: {value: 5, message: 'Minimum length is 5'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Invalid email address'
      }
    }
  },
  affiliation: {
    label: 'Affiliation',
    help: 'Select or type in the current affiliation?',
    validation: {
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  role: {
    label: 'Role',
    help: 'For this software',
    validation: {
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  orcid: {
    label: 'ORCID',
    help: '16 digits, pattern 0000-0000-0000-0000',
    validation: {
      pattern: {
        value: /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/,
        message: 'Invalid pattern, not a 0000-0000-0000-0000'
      }
    }
  }
}

export type ContributorInformationConfig = typeof contributorInformation


export const organisationInformation = {
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
  name:{
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
        value: /^https?:\/\/.+\..+/,
        message: 'URL should start with http(s):// and have at least one dot (.)'
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
      required: 'The source of testimonal is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  }
}

export type TestimonialInformationConfig = typeof testimonialInformation

export const mentionInformation = {
  sectionTitle: 'Mentions',
  mentionType: {
    label: 'Type',
    help: 'Select mention type',
    validation: {
      required: 'Mention type is required'
    }
  },
  date: {
    label: 'Date',
    help: 'Article date',
    validation: {
      required: false
    }
  },
  title: {
    label: 'Title',
    help: 'Article title',
    validation: {
      required: 'The title is required',
    }
  },
  author: {
    label: 'Author',
    help: 'List all authors',
    validation: {
      required:false
    }
  },
  url: {
    label: 'Link',
    help: 'Provide URL to publication',
    validation: {
      pattern: {
        value: /^https?:\/\/.+\..+/,
        message: 'URL should start with http(s):// have at least one dot (.)'
      }
    }
  },
  is_featured: {
    label: 'Featured',
    validation: {
      required: false
    }
  },
  image_url: {
    label: 'Image',
    help:'Provide URL to image',
    validation: {
      pattern: {
        value: /^https?:\/\/.+\..+/,
        message: 'URL should start with http(s):// have at least one dot (.)'
      }
    }
  },
  findMention: {
    title: 'Find mention',
    subtitle: 'Search mentions scraped from Zotero',
    label: 'Search for mentions',
    help: 'Type the title or the URL of scraped mention (at least first 2 letters)',
    // reset value after selected
    reset: true,
    validation: {
      // minlength to trigger api search
      minLength: 2
    }
  }
}


export const relatedSoftwareInformation = {
  title: 'Related software',
  subtitle:(brand_name:string)=>`Mention software often used together with ${brand_name}`,
  help: 'Select related RSD software'
}
