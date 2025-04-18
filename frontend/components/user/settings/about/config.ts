// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

const config = {
  description: {
    title: 'About me',
    subtitle: 'Provide the content of about me page. It will be shown on you public profile page. If content is not provided about me page is hidden.',
    validation: {
      minLength: {value: 16, message: 'Minimum length is 16'},
      maxLength: {value: 10000, message: 'Maximum length is 10.000'},
    }
  }
}

export default config
