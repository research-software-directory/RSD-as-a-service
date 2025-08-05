// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth/AuthProvider'

export default function AccountInfo() {
  const {user} = useSession()

  return (
    <div className="grid lg:grid-cols-2 gap-12 text-base-content-secondary mt-12">
      <div>
        <div>Profile id</div>
        {user?.account ?? ''}
      </div>
      <div>
        <div>Role</div>
        {user?.role ?? ''}
      </div>
    </div>
  )
}
