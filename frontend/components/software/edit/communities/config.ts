// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export const config = {
  title: 'Your communities',
  findCommunity: {
    title: 'Join community',
    subtitle: 'We search by community name in the RSD',
    label: 'Find RSD community',
    help: 'At least the first 2 letters of the community name',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 2,
    }
  },
}

export default config
