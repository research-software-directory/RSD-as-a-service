// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

const config = {
  description: {
    title: 'About page',
    subtitle: 'Provide the content of about page. If content is not provided about page is hidden.',
    validation: {
      minLength: {value: 16, message: 'Minimum length is 16'},
      maxLength: {value: 10000, message: 'Maximum length is 10.000'},
    }
  }
}

export default config
