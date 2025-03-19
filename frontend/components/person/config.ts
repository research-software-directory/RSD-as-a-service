// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

export const modalConfig = {
  is_contact_person: {
    label: 'Contact person',
    help: 'Is this the main contact person?'
  },
  given_names: {
    label: 'First name / Given name(s)',
    help: 'One or more given names',
    validation: {
      required: 'First name is required',
      minLength: {value: 1, message: 'Minimum length is 1'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  family_names: {
    label: 'Last name / Family name(s)',
    help: 'Include "de/van/van den ...etc."',
    validation: {
      required: 'Family name is required',
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  email_address: {
    label: 'Email',
    help: 'Contact person should have an email',
    validation: (required: boolean) => ({
      required: required ? 'Contact person should have an email' : false,
      minLength: {value: 5, message: 'Minimum length is 5'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Invalid email address'
      }
    })
  },
  affiliation: {
    label: 'Affiliation',
    help: 'Select or type in the current affiliation',
    validation: {
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^\S+( \S+)*$/,
        message: 'Make sure to remove all redundant spaces'
      },
    }
  },
  role: {
    label: 'Role',
    // language=text
    help: 'Select from list or type in',
    validation: {
      minLength: {value: 2, message: 'Minimum length is 2'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^\S+( \S+)*$/,
        message: 'Make sure to remove all redundant spaces'
      },
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

export default modalConfig
