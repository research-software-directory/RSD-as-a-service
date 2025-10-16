// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {EditSoftwareProvider} from '~/components/software/edit/context/editSoftwareContext'

/**
 * Wraps tested component with the EditProjectProvider (context)
 * @param param0
 * @returns
 */
export function WithSoftwareContext(props?:any) {
  return (
    <EditSoftwareProvider
      {...props}
    />
  )
}
