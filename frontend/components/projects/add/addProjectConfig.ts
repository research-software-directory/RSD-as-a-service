// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export const addConfig = {
  title:'Add project',
  addInfo: `
  Please provide name and short description for your project.
  `,
  project_title: {
    label: 'Title',
    help: 'Required. Provide project name to use as a title of your project page.',
    validation: {
      required: 'Title is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  project_subtitle: {
    label: 'Subtitle',
    help: 'Provide short description of your project to use as page subtitle.',
    validation: {
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 300, message: 'Maximum length is 300'},
    }
  },
  slug: {
    label: 'The url of this project will be',
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

