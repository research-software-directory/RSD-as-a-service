// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export const cfg = {
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

export default cfg
