// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'

export default function BasicProfileProps() {
  const {user} = useSession()
  return (
    <>
      <h2>Your profile properties</h2>
      <div className="py-4">
        <div>Profile id</div>
        {user?.account ?? ''}
      </div>
      <div className="py-4">
        <div>Role</div>
        {user?.role ?? ''}
      </div>
    </>
  )
}
