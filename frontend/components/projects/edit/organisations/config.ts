
export const cfgOrganisations = {
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
  }
}
