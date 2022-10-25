// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export const addConfig = {
  title:'Add software',
  addInfo: `
  Please provide name and short description for your software.
  `,
  brand_name: {
    label: 'Name',
    help: 'Required. Provide software name to use as a title of your software page.',
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
      // required: 'Name is required',
      minLength: {value: 10, message: 'Minimum length is 10'},
      maxLength: {value: 300, message: 'Maximum length is 300'},
    }
  },
  slug: {
    label: 'The url of this software will be',
    help: 'You can change slug. Use letters, numbers and dash "-". Other characters are not allowed.',
    validation: {
      required: 'The slug value is required.',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
        message: 'Restricted input violiation. Use letters, numbers and dashes "-" only between other input.'
      }
    }
  }
}

