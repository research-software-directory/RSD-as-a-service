// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2025 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

export const cfgTeamMembers = {
  title: 'Team Members',
  find: {
    title: 'Add member',
    subtitle: (include_orcid:boolean=true) => {
      if (include_orcid) {
        return 'We search by name or ORCID in RSD and ORCID databases'
      }
      return 'We search by name or ORCID in RSD database'
    },
    label: 'Find or add team member',
    help: 'At least 2 letters, use pattern {First name} {Last name} or 0000-0000-0000-0000',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 2,
    }
  },
  // Use default modal configuration from person for other entries
}
