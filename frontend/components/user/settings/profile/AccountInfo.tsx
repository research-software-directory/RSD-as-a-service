// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth/AuthProvider'
import Button from '@mui/material/Button'

export default function AccountInfo() {
  const {user} = useSession()

  return (
    <div className="grid lg:grid-cols-2 gap-12 text-base-content-secondary mt-12">
      <div>
        <div>Profile id</div>
        {user?.account ?? ''}
        <Button
          color='primary'
          href={`/personal-profile/${user?.account}`}
        >
          New Personal Profile
        </Button>
      </div>
      <div>
        <div>Role</div>
        {user?.role ?? ''}
      </div>
    </div>
  )
}
