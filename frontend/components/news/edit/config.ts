// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export const newsConfig = {
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
  title: {
    label: 'Title',
    help: '',
    // react-hook-form validation rules
    validation: {
      required: 'Title is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  author: {
    label: 'Authors',
    help: '',
    validation: {
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 200, message: 'Maximum length is 200'},
    }
  },
  summary: {
    label: 'Summary',
    help: 'The summary is used in the card and on the RSD homepage to link to the article',
    validation: {
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 300, message: 'Maximum length is 300'},
    }
  },
  // field for markdown
  description: {
    label: 'Content',
    help: 'Provide the content of news article',
    validation: {
      // we do not show error message for this one, we use only maxLength value
      maxLength: {value: 10000, message: 'Maximum length is 10000'},
    }
  },
  pageStatus: {
    title: 'Status',
    subtitle: 'A published news article is visible to others.'
  },
  is_published: {
    label: 'Published',
  },
  publication_date:{
    label: 'Publication date',
    help: 'Provide publication date'
  },
  // field for logo upload
  image: {
    label: 'Article images',
    help: 'First image is used in the news card.'
  },
}
