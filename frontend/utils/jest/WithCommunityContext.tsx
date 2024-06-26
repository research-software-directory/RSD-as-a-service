// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CommunityProvider} from '~/components/communities/context/index'

/**
 * Wraps tested component with the EditProjectProvider (context)
 * @param param0
 * @returns
 */
export function WithCommunityContext(props?:any) {
  return (
    <CommunityProvider
      {...props}
    />
  )
}
