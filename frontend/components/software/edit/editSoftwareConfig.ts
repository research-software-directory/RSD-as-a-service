
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
    label: 'Url to markdown file',
    help: 'Point to the location of markdown file including the filename.'
  },
  concept_doi: {
    label: 'Concept DOI',
    help: 'Inital DOI of your software',
    options: {
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
