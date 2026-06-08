// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2025 dv4all
// SPDX-FileCopyrightText: 2022 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
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
    help: 'Type at least 2 letters, use first, last name or ORCID',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 2,
    }
  },
  // Use default modal configuration from person for other entries
}
