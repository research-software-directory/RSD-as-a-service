// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export const newsConfig = {
  page_title:'Add news item',
  addInfo: `
  Please provide title and publication date of news item.
  `,
  title: {
    label: 'Title',
    help: '',
    validation: {
      required: 'Title is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  publication_date:{
    label: 'Publication date',
    help: '',
    validation: {
      required: 'Publication date is required'
    }
  },
  slug: {
    label: 'The url of this page will be',
    help: 'You can change slug. Use letters, numbers and dash "-". Other characters are not allowed.',
    validation: {
      required: 'The slug value is required.',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
      pattern: {
        value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
        message: 'Restricted input violation. Use letters, numbers and dashes "-" only between other input.'
      }
    }
  }
}

