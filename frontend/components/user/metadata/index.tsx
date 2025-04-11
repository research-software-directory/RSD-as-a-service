// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import UserAvatar from './UserAvatar'
import UserInfo from './UserInfo'


export default function UserMetadata() {
  return (
    <section className="grid md:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_5fr] gap-4 mt-8">
      <BaseSurfaceRounded className="flex justify-center p-4 overflow-hidden relative">
        <UserAvatar />
      </BaseSurfaceRounded>
      <BaseSurfaceRounded className="grid lg:grid-cols-[3fr_1fr] lg:gap-8 xl:grid-cols-[4fr_1fr] py-4 px-8">
        <UserInfo/>
      </BaseSurfaceRounded>
    </section>
  )
}
