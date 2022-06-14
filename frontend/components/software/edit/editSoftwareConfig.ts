// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export const softwareInformation = {
  brand_name: {
    label: 'Name',
    help: 'Provide software name to use as a title of your software page.',
    // react-hook-form validation rules
    validation: {
      required: 'Name is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  short_statement: {
    label: 'Short description',
    help: 'Provide short description of your software to use as page subtitle.',
    validation: {
      required: 'Short description is required',
      minLength: {value: 10, message: 'Minimum length is 10'},
      maxLength: {value: 300, message: 'Maximum length is 300'},
    }
  },
  get_started_url: {
    label: 'Get Started Url',
    help: 'Link to source code repository or documentation web page.',
    validation: {
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https?:\/\/.+\..+/,
        message: 'Url should start with http(s):// and use at least one dot (.)'
      }
    }
  },
  repository_url: {
    label: 'Repository Url',
    help: 'Link to source code repository',
    validation: {
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https?:\/\/.+\..+/,
        message: 'Url should start with htps://, have at least one dot (.) and at least one slash (/).'
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
    help: (brand_name: string) => `What ${brand_name} can do for you`
  },
  // field for markdown url
  description_url: {
    label: 'Url location of markdown file',
    help: 'Point to the location of markdown file including the filename.',
    validation: {
      required: 'Valid markdown url must be provided',
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^https?:\/\/.+\..+.md$/,
        message: 'Url should start with http(s):// have at least one dot (.) and end with (.md)'
      }
    }
  },
  concept_doi: {
    label: 'Concept DOI',
    help: 'Initial DOI of your software',
    validation: {
      minLength: {value: 7, message: 'Minimum length is 7'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  pageStatus: {
    title: 'Page status',
    subtitle: 'Only published software is visible to others'
  },
  is_published: {
    label: 'Published',
  },
  // is_featured: {
  //   label: 'Featured',
  // },
  keywords: {
    title: 'Keywords',
    subtitle: 'Find, add or import using concept DOI.',
    label: 'Find or add keyword',
    help: 'Start typing for the suggestions',
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
    help: 'Select license'
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
    subtitle: 'We search by name in RSD and ORCID databases',
    label: 'Find or add contributor',
    help: 'At least 3 letters, use pattern {First name} {Last name}',
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
      maxLength: {value: 100, message: 'Maximum length is 100'},
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
    subtitle: 'We search organisation name in RSD and ROR databases',
    label: 'Find or add organisation',
    help: 'At least fist 3 letters of organisation name',
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
    help: 'Provide url to publication',
    validation: {
      pattern: {
        value: /^https?:\/\/.+\..+/,
        message: 'Url should start with http(s):// have at least one dot (.)'
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
    help:'Provide url to image',
    validation: {
      pattern: {
        value: /^https?:\/\/.+\..+/,
        message: 'Url should start with http(s):// have at least one dot (.)'
      }
    }
  },
  findMention: {
    title: 'Find mention',
    subtitle: 'Search mentions scraped from Zotero',
    label: 'Search for mentions',
    help: 'Type the title or the url of scraped mention (at least first 2 letters)',
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
