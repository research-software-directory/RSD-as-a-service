
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
    help: 'Inital DOI of your software',
    validation: {
      minLength: {value: 7, message: 'Minimum length is 7'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  is_published: {
    label: 'Published',
  },
  is_featured: {
    label: 'Featured',
  },
  tags: {
    label: 'Keywords',
    help:'Select keyword'
  },
  licenses:{
    label: 'Licenses',
    help:'Select license'
  }
}

export type SoftwareInformationConfig = typeof softwareInformation

export const contributorInformation = {
  findContributor: {
    title: 'Add contributor',
    subtitle: 'We search by name in RSD and ORCID databases',
    label: '{First name} {Last name}',
    help: 'Type at least 3 letters of contributor\'s name'
  },
  software: {
    label:'hidden software id'
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
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  family_names: {
    label: 'Last name / Family name(s)',
    help: 'Family names including "de/van/van den"',
    validation: {
      required: 'Family name is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  email_address: {
    label: 'Email',
    help: 'Contact email',
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
    help: 'Where the contributor works currently?',
    validation: {
      minLength: {value: 5, message: 'Minimum length is 5'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  role: {
    label: 'Role',
    help: 'For this software',
    validation: {
      minLength: {value: 5, message: 'Minimum length is 5'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  orcid: {
    label: 'ORCID',
    help: 'Only the personal part of ID',
    validation: {
      minLength: {value: 10, message: 'Minimum length is 10'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  }
}

export type ContributorInformationConfig = typeof contributorInformation
