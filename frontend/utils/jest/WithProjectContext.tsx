// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {EditProjectProvider} from '~/components/projects/edit/context/editProjectContext'

/**
 * Wraps tested component with the EditProjectProvider (context)
 * @param param0
 * @returns
 */
export function WithProjectContext(props?:any) {
  return (
    <EditProjectProvider
      {...props}
    />
  )
}
