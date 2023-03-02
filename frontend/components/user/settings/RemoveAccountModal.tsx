// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export const whatWillBeRemoved = `
Your account will be removed from software, project and organisation mantainers.
All invitations created or claimed by this account and all related user profiles will also be removed.
`


export default function RemoveAccountMessage({account_id}: { account_id: string }) {
  return (
    <>
      <p>
        Are you sure you want to completely remove account <strong>{account_id}</strong> from RSD?
      </p>
      <p className="mt-4">
        {whatWillBeRemoved}
      </p>
    </>
  )
}
