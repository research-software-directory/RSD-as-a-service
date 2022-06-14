// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Session} from '~/auth'

export default function UserProfile({session}: { session: Session }) {

  return (
    <div>
      {/* <h1>Your profile</h1> */}
      <div className="py-4">
        <div>Account id</div>
        {session?.user?.account ?? ''}
      </div>
      <div className="py-4">
        <div>Name</div>
        {session?.user?.name ?? ''}
      </div>
      <div className="py-4">
        <div>Role</div>
        {session?.user?.role ?? ''}
      </div>
      {/* <pre className="w-[60rem]">
        {JSON.stringify(session,null,2)}
      </pre> */}
    </div>
  )
}
